import { AfterViewInit, Component, inject, signal } from '@angular/core';
import * as L from 'leaflet';
import { map, Routing, latLng, icon, marker, tileLayer, GeoJSON } from 'leaflet';
import 'leaflet-routing-machine';
import { alex_raml_tram_line } from '../../assets/assets';
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

  ngAfterViewInit(): void {
    this.initMap();
  }
  centerPoint = L.latLng(31.20600, 29.92392)
  mahataElGam3a = L.latLng(31.211056, 29.92028302646695)

  tramIcon = L.icon({
    iconUrl: "tramIcon.png",
    iconSize: [110, 60],
    iconAnchor: [38, 38],  // the relative position of the tip to the top-left corner
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
    const arr: any = []
    // add the tram lines
    const tramLine = new L.GeoJSON(alex_raml_tram_line as any, {
      onEachFeature: (feature: any, layer: L.Layer) => {
        layer.bindPopup(feature.properties['name']);

      }
      , pointToLayer: (geoJsonPoint: any, latlng: L.LatLng) => {
        arr.push(latlng)
        const marker = L.marker(latlng, { icon: this.tramIcon, draggable: false })
        marker.addEventListener('click', () => {
          this.leftSideBar.set(true)
        })
        return marker
      }
    }).addTo(this.map as any)

    console.log(tramLine);


    if (Object.keys(this.gates).includes(param)) {
      this.startRoutingFromGate(param)
    } else if (param == 'select') {
      this.handleSelectStartPoint()
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
    this.routing?.remove()
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
    }).addTo(this.map as any)
  }

  startRoutingFromGate(gate: string) {
    this.routing = Routing.control({
      waypoints: [
        this.gates[gate],
        this.mahataElGam3a
      ],
      routeWhileDragging: false,
      router: L.Routing.osrmv1({
        // This specific URL is a community-hosted instance for walking/foot paths
        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
        profile: 'foot' // Explicitly set the profile to foot
      }),
    }).addTo(this.map as any)
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
      const popUp = L.popup().setLatLng(e.latlng)
        .setContent(container)
        .addTo(this.map as any)
      // events for the popup dom (click) for buttons
      L.DomEvent.on(startBtn, 'click', () => {
        popUp.close()
        console.log("selected");
        this.routing = Routing.control({
          waypoints: [
            e.latlng,
            this.mahataElGam3a
          ],
          routeWhileDragging: false,
          router: L.Routing.osrmv1({
            serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
            profile: 'foot' // Explicitly set the profile to foot
          }),
        }).addTo(this.map as any)
        this.map?.removeEventListener('click', selection)
        this.initMapDomRouting()

      })
    }
    this.map?.addEventListener("click", selection)
  }

  selectPointThen = (then: Function) => {
    const selection = (e: any) => {
      console.log(e.latlng);
      const container = L.DomUtil.create('div')
        , startBtn = this.createButton('Confirm', container);
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

  leftSideBar = signal(false);

}
