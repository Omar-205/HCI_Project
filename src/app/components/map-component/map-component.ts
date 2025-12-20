import { AfterViewInit, Component, inject, signal } from '@angular/core';
import * as L from 'leaflet';
import { map, Routing, latLng, icon, marker, tileLayer, GeoJSON } from 'leaflet';
import 'leaflet-routing-machine';
import { alex_raml_tram_line, alexandriaMonuments, interplatedTramPoint } from '../../assets/assets';
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

    trainIcon = L.icon({
    iconUrl: "train.png",
    iconSize: [70, 40],
    iconAnchor: [38, 38],  // the relative position of the tip to the top-left corner
    popupAnchor: [-3, -76],
  });
  

  selectedStation = signal<null | { name: string, latlng: L.LatLng }>(null)
  selectedMonument = signal<null | { name: string, latlng: L.LatLng, description: string, address: string, wikipedia: string }>(null)

  ngAfterViewInit(): void {
    this.initMap();
  }
  private trains: TrainState[] = [];
  arr: L.LatLng[] = []
  start_direction: any;
    private stations: L.LatLng[] = alex_raml_tram_line.features.map(feature =>
    L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
  );

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

    leftSideBar = signal(false);

  initializeTrains() {
    const numberOfTrains = 5;
    const stationInterval = Math.floor(this.stations.length / numberOfTrains);
    

    for (let i = 0; i < numberOfTrains; i++) {
      const startingStationIndex = i * stationInterval;
      const trainMarker = L.marker(this.stations[startingStationIndex], {
        riseOnHover: true,
        icon: this.trainIcon,
        alt: `Train ${i + 1}`,
        draggable: false
      }).addTo(this.map!);

      // Add popup to identify each train
      trainMarker.bindPopup(`Train ${i + 1}`);

      this.trains.push({
        marker: trainMarker,
        currentStationIndex: startingStationIndex,
        isMoving: false,
        animationFrameId: null,
        id: i + 1
      });
    }
  }


  // Start a specific train
  private startTrain(train: TrainState) {
    train.isMoving = true;
    this.moveTrainToNextStation(train);
  }

  // Configuration options for train behavior
  private trainConfig = {
    loopMode: 'infinite' as 'infinite' | 'once' | 'limited', // How trains should loop
    maxLoops: 3, // Only used if loopMode is 'limited'
    endWaitTime: 5000, // Wait time at final station before restarting (ms)
    stationWaitTime: 2000, // Wait time at regular stations (ms)
    totalSimulationTime: 300000 // Total simulation time in ms (5 minutes), set to 0 for infinite
  };

  private simulationStartTime: number = 0;
  private simulationTimeoutId: number | null = null;

  // Move a specific train to its next station
  private moveTrainToNextStation(train: TrainState) {
    if (!train.isMoving) return;

    // Check if total simulation time has elapsed
    if (this.trainConfig.totalSimulationTime > 0) {
      const elapsed = Date.now() - this.simulationStartTime;
      if (elapsed >= this.trainConfig.totalSimulationTime) {
        this.stopAllTrains();
        console.log('Simulation time completed. All trains stopped.');
        return;
      }
    }

    // Check if reached the end of the line
    if (train.currentStationIndex >= this.stations.length - 1) {
      this.handleTrainReachedEnd(train);
      return;
    }

    const start = this.stations[train.currentStationIndex];
    const end = this.stations[train.currentStationIndex + 1];

    this.animateTrainMovement(train, start, end, () => {
      train.currentStationIndex++;

      // Show which station the train arrived at
      const stationName = alex_raml_tram_line.features[train.currentStationIndex]?.properties.name || 'Unknown';
      train.marker.setPopupContent(`
      <div style="text-align: center;">
        <strong>Train ${train.id}</strong><br>
        ${stationName}<br>
        <small>Station ${train.currentStationIndex + 1}/${this.stations.length}</small>
      </div>
    `);

      // Wait at the station before moving to next
      setTimeout(() => {
        if (train.isMoving) {
          this.moveTrainToNextStation(train);
        }
      }, this.trainConfig.stationWaitTime);
    });
  }

  // Handle what happens when train reaches the end
  private handleTrainReachedEnd(train: TrainState & { loopCount?: number }) {
    // Initialize loop count if not exists
    if (train.loopCount === undefined) {
      train.loopCount = 0;
    }

    const stationName = alex_raml_tram_line.features[train.currentStationIndex]?.properties.name || 'Unknown';

    switch (this.trainConfig.loopMode) {
      case 'once':
        // Stop the train permanently
        train.isMoving = false;
        train.marker.setPopupContent(`
        <div style="text-align: center;">
          <strong>Train ${train.id}</strong><br>
          ${stationName}<br>
          <small>✓ Journey Complete</small>
        </div>
      `);
        console.log(`Train ${train.id} completed its journey and stopped.`);
        break;

      case 'limited':
        train.loopCount++;
        if (train.loopCount >= this.trainConfig.maxLoops) {
          // Stop after max loops reached
          train.isMoving = false;
          train.marker.setPopupContent(`
          <div style="text-align: center;">
            <strong>Train ${train.id}</strong><br>
            ${stationName}<br>
            <small>✓ Completed ${train.loopCount} loops</small>
          </div>
        `);
          console.log(`Train ${train.id} completed ${train.loopCount} loops and stopped.`);
        } else {
          // Continue looping
          train.marker.setPopupContent(`
          <div style="text-align: center;">
            <strong>Train ${train.id}</strong><br>
            ${stationName}<br>
            <small>Loop ${train.loopCount}/${this.trainConfig.maxLoops} - Restarting...</small>
          </div>
        `);

          setTimeout(() => {
            if (train.isMoving) {
              train.currentStationIndex = 0; // Reset to start
              train.marker.setLatLng(this.stations[0]);
              this.moveTrainToNextStation(train);
            }
          }, this.trainConfig.endWaitTime);
        }
        break;

      case 'infinite':
      default:
        // Loop forever
        train.loopCount++;
        train.marker.setPopupContent(`
        <div style="text-align: center;">
          <strong>Train ${train.id}</strong><br>
          ${stationName}<br>
          <small>Loop ${train.loopCount} - Restarting...</small>
        </div>
      `);

        setTimeout(() => {
          if (train.isMoving) {
            train.currentStationIndex = 0; // Reset to start
            train.marker.setLatLng(this.stations[0]);
            this.moveTrainToNextStation(train);
          }
        }, this.trainConfig.endWaitTime);
        break;
    }
  }

  // Start all trains with optional configuration
  startAllTrains(config?: Partial<typeof this.trainConfig>) {
    // Update config if provided
    if (config) {
      this.trainConfig = { ...this.trainConfig, ...config };
    }

    // Record simulation start time
    this.simulationStartTime = Date.now();

    // Start all trains
    this.trains.forEach(train => {
      if (!train.isMoving) {
        this.startTrain(train);
      }
    });

    // Set up auto-stop timer if totalSimulationTime is set
    if (this.trainConfig.totalSimulationTime > 0) {
      this.simulationTimeoutId = window.setTimeout(() => {
        this.stopAllTrains();
        console.log('Total simulation time reached. All trains stopped.');
      }, this.trainConfig.totalSimulationTime);
    }
  }

  // Update stopAllTrains to clear timeout
  stopAllTrains() {
    this.trains.forEach(train => {
      train.isMoving = false;
      if (train.animationFrameId !== null) {
        cancelAnimationFrame(train.animationFrameId);
        train.animationFrameId = null;
      }
    });

    // Clear simulation timeout
    if (this.simulationTimeoutId !== null) {
      clearTimeout(this.simulationTimeoutId);
      this.simulationTimeoutId = null;
    }
  }

  // Interpolate points between two stations for smooth movement
  private interpolatePoints(start: L.LatLng, end: L.LatLng, steps: number): L.LatLng[] {
    const points: L.LatLng[] = [];

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = start.lat + (end.lat - start.lat) * ratio;
      const lng = start.lng + (end.lng - start.lng) * ratio;
      points.push(L.latLng(lat, lng));
    }

    return points;
  }
  // Animate a specific train's movement
  private animateTrainMovement(train: TrainState, start: L.LatLng, end: L.LatLng, onComplete: () => void) {
    const steps = 100;
    const duration = 60000; // 5 seconds per segment
    let ps = interplatedTramPoint.map((arr) => L.latLng(arr[1], arr[0]))
    const points: L.LatLng[] = ps.slice((train.id - 1) * (ps.length) / 5, (train.id) * (ps.length) / 5)

    let currentPointIndex = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      currentPointIndex = Math.floor(progress * (points.length - 1));

      if (currentPointIndex < points.length) {
        train.marker.setLatLng(points[currentPointIndex]);

        if (progress < 1) {
          train.animationFrameId = requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      }
    };

    animate();
  }



}
interface TrainState {
  marker: L.Marker;
  currentStationIndex: number;
  isMoving: boolean;
  animationFrameId: number | null;
  id: number;
}

export const monumnetIcon = L.icon({
  iconUrl: "monumentIcon.png",
  iconSize: [160, 90],
  iconAnchor: [100, 100],  // the relative position of the tip to the top-left corner
  popupAnchor: [-3, -76],
})
