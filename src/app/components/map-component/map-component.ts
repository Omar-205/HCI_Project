import { AfterViewInit, Component, inject, signal } from '@angular/core';
import * as L from 'leaflet';
import { map, Routing, latLng, icon, marker, tileLayer, GeoJSON } from 'leaflet';
import 'leaflet-routing-machine';
import { alex_raml_tram_line, alexandriaMonuments } from '../../assets/assets';
import "leaflet"
import "@angular/cdk/dialog"
import { Dialog } from '@angular/cdk/dialog';
import { MapModal } from '../map-modal/map-modal';

@Component({
  selector: 'app-map-component',
  imports: [],
  templateUrl: './map-component.html',
  styleUrl: './map-component.css',
})
export class MapComponent implements AfterViewInit {

  dialog = inject(Dialog)

  private map: L.Map | undefined;
  tramLineLayer!:L.GeoJSON
  monumentsLayer!: L.GeoJSON;
  layerControl!: L.Control.Layers;

  

  selectedStation = signal<null | { name: string, latlng: L.LatLng }>(null)
  selectedMonument = signal<null | { name: string, latlng: L.LatLng, description: string, address: string, wikipedia: string }>(null)

  ngAfterViewInit(): void {
    this.initMap();
  }
  arr: L.LatLng[] = []
  start_direction: any;

  getdistance(marker: L.LatLng, tram: L.LatLng) {
    let deltax = (marker.lat - tram.lat)
    let deltay = (marker.lng - tram.lng)
    return Math.sqrt(Math.pow(deltax, 2) + Math.pow(deltay, 2))
  }

  getShortestPath(marker: any, LatLng: L.LatLng[]): L.LatLng {

    const markerLatLng = marker
    let shortest_Key = null;
    let shortest_distance = null;
    let shortest_station = null;
    // for(mark of LatLng)
    for (let i = 0; i < LatLng.length; i++) {
      const dist = this.getdistance(markerLatLng, LatLng[i])
      if (shortest_distance == null || dist < shortest_distance) {
        shortest_Key = i
        shortest_distance = dist
        shortest_station = LatLng[i]
      }
    }
    console.log(shortest_Key, shortest_station)
    return shortest_station as L.LatLng;

  }
  centerPoint = L.latLng(31.20600, 29.92392)
  mahataElGam3a = L.latLng(31.211056, 29.92028302646695)
  startPoint = this.centerPoint;
  destinationPoint = this.mahataElGam3a;

  tramIcon = L.icon({
    iconUrl: "tramIcon.png",
    iconSize: [110, 60],
    iconAnchor: [60, 60],  // the relative position of the tip to the top-left corner
    popupAnchor: [-3, -76],

  })



  private initMap(): void {
    this.map = map('map', {
      center: this.centerPoint,
      zoom: 18,
      zoomControl: true,
      maxZoom: 30
    });

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 30,
      maxNativeZoom: 30
    });

    const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const tramMarker = L.marker([31.206006, 29.923298], {
      riseOnHover: true,
      icon: this.tramIcon,
      alt: "error loading the icon",
      draggable: false
    })
    //.addTo(this.map)
    const baseLayers = {
      tiles,
      googleStreets
    }
    const markers = {
      // "tram m": tramMarker
    }

    const ctr = L.control.layers(baseLayers, markers, { collapsed: false })
    this.tramLineLayer= new L.GeoJSON(alex_raml_tram_line as any, {
      onEachFeature: (feature: any, layer: L.Layer) => {
        layer.bindPopup(feature.properties['name']);
        layer.addEventListener('click', (e) => {
          this.selectedMonument.set(null)
          const latnlgcords = [feature.geometry.coordinates[1] as number, feature.geometry.coordinates[0] as number]
          this.selectedStation.set({ name: feature.properties['name'], latlng: L.latLng(latnlgcords as any) })
        })

      }
      , pointToLayer: (geoJsonPoint: any, latlng: L.LatLng) => {
        this.arr.push(latlng)
        const marker = L.marker(latlng, { icon: this.tramIcon, draggable: false })

        return marker
      }
    });

    this.monumentsLayer = new L.GeoJSON(alexandriaMonuments as any, {
      onEachFeature: (feature: any, layer: L.Layer) => {
        layer.bindPopup(feature.properties['name']);
        layer.addEventListener('click', (e) => {
          this.selectedStation.set(null)
          const latnlgcords = [feature.geometry.coordinates[1] as number, feature.geometry.coordinates[0] as number]
          this.selectedMonument.set({
            name: feature.properties['name'],
            latlng: L.latLng(latnlgcords as any),
            description: feature.properties['description'],
            address: feature.properties['address'],
            wikipedia: feature.properties['wikipedia']
          })
        })

      }
      , pointToLayer: (geoJsonPoint: any, latlng: L.LatLng) => {
        const marker = L.marker(latlng, { icon: monumnetIcon, draggable: false })

        return marker
      }
    });

    this.tramLineLayer.addTo(this.map);
    this.monumentsLayer.addTo(this.map);


    this.layerControl = L.control.layers({},
      {
        'Tram Station & Lines':this.tramLineLayer,
        'Alexandria Monuments':this.monumentsLayer
      },
      {collapsed:false}
    ).addTo(this.map);

    tiles.addTo(this.map);
    ctr.addTo(this.map)

    this.dialog.open(MapModal, {
      hasBackdrop: true,
      data: {
        gates: Object.keys(this.gates)
      },
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false
      // scrollStrategy: block
    }).closed.subscribe(ret => this.closeModal(ret as string))

  }
  closeModal(param: string) { // after selecting from the popup
    console.log(param);
    
    if (Object.keys(this.gates).includes(param)) {
      this.startRoutingFromGate(param)
      this.start_direction = param
      console.log(this.getShortestPath(this.gates[param], this.arr))
    } else if (param == 'select') {
      this.handleSelectStartPoint();
      return
    }
    this.initMapDomRouting()

  }
  routing: undefined | Routing.Control;

  gates: Record<string, L.LatLng> = {
    "E3dady gate": latLng(31.206537, 29.923098),
    "Gamal Abel Naser": latLng(31.205734, 29.925426),
    "El Garage gate": latLng(31.207996, 29.922363),
    "Entag gate": latLng(31.208184, 29.925501),
    "Side gate": latLng(31.206909, 29.925710)
  }

  routeFromTo(source: L.LatLng, destination: L.LatLng) {
    if (!this.map) return
    if (this.routing)
      this.map.removeControl(this.routing)
    console.log(source,destination)
    this.routing = Routing.control({
      waypoints: [
        source,
        destination
      ],
      routeWhileDragging: false,
      router: L.Routing.osrmv1({
        // This specific URL is a community-hosted instance for walking/foot paths
        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
        profile: 'foot' // Explicitly set the profile to foot
      }),
      show:true
    }).addTo(this.map)
  }

  startRoutingFromGate(gate: string) {
    this.startPoint = this.gates[gate]
    this.destinationPoint = this.getShortestPath(this.gates[gate], this.arr)
    this.routeFromTo(this.startPoint, this.destinationPoint)
  }

  inAppNavigation(destination: string) {
    if (this.selectedStation() != null) {
      this.destinationPoint = this.selectedStation()?.latlng as any
      this.routeFromTo(this.startPoint, this.destinationPoint)
    }
  }

  handleSelectStartPoint = () => {
    const selection = (e: any) => {
      console.log(e.latlng);
      const container = L.DomUtil.create('div')
        , startBtn = this.createButton('Confirm', container);
      startBtn.style.backgroundColor = 'green'
      startBtn.style.padding = '10px'
      startBtn.style.color = 'white'
      // create the label with the buttons
      console.log(this.arr)
      const popUp = L.popup().setLatLng(e.latlng)
        .setContent(container)
        .addTo(this.map as any)
      // events for the popup dom (click) for buttons
      L.DomEvent.on(startBtn, 'click', () => {
        popUp.close()
        console.log("selected");
        this.routeFromTo(e.latlng, this.getShortestPath(e.latlng, this.arr)) // todo: change to dynamic
        this.map?.removeEventListener('click', selection)
        this.initMapDomRouting()

      })
    }
    this.map?.addEventListener("click", selection)
  }

  selectStartPoint = (then: Function) => {
    const selection = (e: any) => {
      console.log(e.latlng);
      const container = L.DomUtil.create('div')
        , startBtn = this.createButton('Confirm start point', container);
      startBtn.style.backgroundColor = 'green'
      startBtn.style.padding = '10px'
      startBtn.style.color = 'white'
      // create the label with the buttons
      const popUp = L.popup().setLatLng(e.latlng)
        .setContent(container)
        .addTo(this.map as any)
      // events for the popup dom (click) for buttons
      L.DomEvent.on(startBtn, 'click', () => {
        popUp.close()
        console.log("selected");
        this.map?.removeEventListener('click', selection)
        then({ start: e.latLng })
      })
    }
    this.map?.addEventListener("click", selection)
  }

  selectDestinationPoint = (then: Function) => {
    const selection = (e: any) => {
      console.log(e.latlng);
      const container = L.DomUtil.create('div')
        , startBtn = this.createButton('Confirm start point', container);
      startBtn.style.backgroundColor = 'green'
      startBtn.style.padding = '10px'
      startBtn.style.color = 'white'
      // create the label with the buttons
      const popUp = L.popup().setLatLng(e.latlng)
        .setContent(container)
        .addTo(this.map as any)
      // events for the popup dom (click) for buttons
      L.DomEvent.on(startBtn, 'click', () => {
        popUp.close()
        console.log("selected");
        this.map?.removeEventListener('click', selection)
        then({ start: e.latLng })
      })
    }
    this.map?.addEventListener("click", selection)
  }


  createButton = (label: any, container: any) => {
    var btn = L.DomUtil.create('button', '', container);
    L.DomUtil.create('br', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  }

  initMapDomRouting() {
    this.map?.addEventListener("click", (e) => {
      console.log(e.latlng);
      this.selectedStation.set(null)
      this.selectedMonument.set(null);
      const container = L.DomUtil.create('div')
        , startBtn = this.createButton('Start from this location', container),
        destBtn = this.createButton('Go to this location', container);
      // create the label with the buttons
      const popUp = L.popup().setLatLng(e.latlng)
        .setContent(container)
        .addTo(this.map as any)
      // events for the popup dom (click) for buttons
      L.DomEvent.on(startBtn, 'click', () => {
        console.log("start");
        this.routing?.spliceWaypoints(0, 1, Routing.waypoint(e.latlng))
        this.map?.closePopup()
        popUp.close()
      })
      L.DomEvent.on(destBtn, 'click', () => {
        console.log("destination");
        this.routing?.spliceWaypoints(1, 2, Routing.waypoint(e.latlng))
        this.map?.closePopup()
        popUp.close()

      })
    })
  }
  navigateUsingGoogle(stationName: string) {
    const destination = encodeURIComponent(`${stationName}, Alexandria, Egypt`);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;
    window.open(mapsUrl, '_blank', 'width=1200,height=800');
  }


}

export const monumnetIcon = L.icon({
  iconUrl: "monumentIcon.png",
  iconSize: [160, 90],
  iconAnchor: [100, 100],  // the relative position of the tip to the top-left corner
  popupAnchor: [-3, -76],
})
