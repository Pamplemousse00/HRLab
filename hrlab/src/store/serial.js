import {
  Module, VuexModule, Mutation, Action,
} from 'vuex-module-decorators';

import SerialPort from 'serialport';

// Private variables
let port = null;

const PacketTypeNames = [
	"???",
	"StartAOO",
	"StartAOOR",
	"StartVOO",
	"StartVOOR",
	"StartAAI",
	"StartAAIH",
	"StartAAIR",
	"StartAAIHR",
	"StartVVI",
	"StartVVIH",
	"StartVVIR",
	"StartVVIHR",
	"StartDOO",
	"StartDOOR",
	"StartDataCapture",
	"StopDataCapture",
	"GetSerialNumber",
	"GetCurrentMode",
	"Ack",
	"DataPacket",
	"SerialNumberPacket"
]

const AckResponseCodes = [
  "Success",
  "Unknown Packet Type",
  "Invalid parameters",
  "Unknown Mode"
]

let pendingHandlers = [];
let currPacket = [];

// Private Functions
function recieveHandler(rxdata) {
  //console.log(rxdata)

  rxdata.forEach(b => {  
    currPacket.push(b)
    
    if(currPacket.length == 17) {
      //console.log("Packet", currPacket)

      const recvChecksum = ((currPacket[16] << 8) | currPacket[15]);
      
      let calculatedChecksum = 0
      for(let i = 0; i < 15; i++) {
        calculatedChecksum = (calculatedChecksum + currPacket[i]) & 0xFFFF;
      }
      
      const valid = (currPacket[0] == 0xFE) && (recvChecksum == calculatedChecksum);
      if(!valid) {
        console.log(`Invalid. ${currPacket[0]} != 0xFE or checksum ${calculatedChecksum} != ${recvChecksum}`);
      } else {
        // console.log(`Valid checksum ${calculatedChecksum} == ${recvChecksum}`);
      }

      if(currPacket[1] == 20 /* Data */) {
        console.log("Data packet", currPacket);
      } else {
        const handler = pendingHandlers.shift();
        handler(currPacket);
      }

      currPacket = []
    }
  })
}

function sendPacket(type, payload, handler) {
  if(port == null) return;

  if(payload == undefined) { payload = []; }
  if(handler == undefined) { handler = function(d){}; }

  if(payload.length < 13) {
    payload.push(...Array(13 - payload.length).fill(0));
  }

  const packet = [0xFE, type, ...payload, 0, 0];

  let checksum = 0
  for(let i = 0; i < 15; i++) {
    checksum = (checksum + packet[i]) & 0xFFFF;
  }
  
  packet[15] = checksum & 0xFF;
  packet[16] = (checksum >> 8) & 0xFF;

  console.log("Sending", new Uint8Array(packet));
  pendingHandlers.push(handler);
  port.write(packet);
}

function handleAck(packet) {
  if(packet[1] == 19 /* ACK */) {
    console.log(`ACK to ${PacketTypeNames[currPacket[2]]}, response code ${currPacket[3]} ${AckResponseCodes[currPacket[3]]}`)
  } else {
    console.log(`Expected ACK got ${PacketTypeNames[packet[1]]}`)
  }
}

@Module({ name: 'serial', namespaced: true })
export default class SerialState extends VuexModule {
  // Public variables
  currentMode = 0;
  collectingData = false;
  serialNumber = "";
  atrSignalReadings = [];
  ventSignalReadings = [];

  @Mutation
  setCurrentMode(mode) {
    this.currentMode = mode;
  }

  @Mutation
  setCollectingData(s) {
    this.collectingData = s;
  }

  @Mutation
  setSerialNumber(s) {
    this.serialNumber = s;
  }

  @Action({ rawError: true })
  async listPorts() {
    const ports = await SerialPort.list()
    return ports.map(x => x.path)
  }

  @Action({ rawError: true })
  async connect(path) {
    console.log(`Connecting to ${path}`);
    
    // connect to serial
    pendingHandlers = [];
    currPacket = [];
    port = new SerialPort(path, { baudRate: 115200 });
    port.on('data', recieveHandler)
    
    await new Promise(resolve => setTimeout(resolve, 300));

    // get the current mode of the pacemaker
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })

    await new Promise(resolve => setTimeout(resolve, 10));
    
    // get the current mode of the pacemaker
    sendPacket(17 /* GetSerialNumber */, [], packet => {
      this.setSerialNumber(packet.slice(2, 10).map(c => String.fromCharCode(c)).join(""));
      console.log("SN", this.serialNumber);
    })
  }

  @Action({ rawError: true })
  disconnect() {
    this.setCurrentMode(0)
    
    port.close()
    port = null
  }

  @Action({ rawError: true })
  async startAOO({p_pulse_rate, p_atrial_width, p_atrial_amplitude}) {
    sendPacket(1 /* StartAOO */, [p_pulse_rate, p_atrial_width, p_atrial_amplitude], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startAOOR(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(2 /* StartAOOR */, [
      p_pulse_rate,
      p_atrial_width,
      p_atrial_amplitude,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startVOO(p_pulse_rate, p_vent_width, p_vent_amplitude) {
    sendPacket(3 /* StartVOO */, [ p_pulse_rate, p_vent_width, p_vent_amplitude ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startVOOR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(4 /* StartVOOR */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startAAI(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP) {
    sendPacket(5 /* StartAAI */, [
      p_pulse_rate,
      p_atrial_width,
      p_atrial_amplitude,
      p_atrial_sensitivity,
      p_ARP & 0xFF,
      (p_ARP >> 8) & 0xFF
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startAAIH(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_hysteresis_rate) {
    sendPacket(6 /* StartAAIH */, [
      p_pulse_rate,
      p_atrial_width,
      p_atrial_amplitude,
      p_atrial_sensitivity,
      p_ARP & 0xFF,
      (p_ARP >> 8) & 0xFF,
      p_hysteresis_rate
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startAAIR(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(7 /* StartAAIR */, [
      p_pulse_rate,
      p_atrial_width,
      p_atrial_amplitude,
      p_atrial_sensitivity,
      p_ARP & 0xFF,
      (p_ARP >> 8) & 0xFF,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }
  
  @Action({ rawError: true })
  async startAAIHR(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_hysteresis_rate, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(8 /* StartAAIHR */, [
      p_pulse_rate,
      p_atrial_width,
      p_atrial_amplitude,
      p_atrial_sensitivity,
      p_ARP & 0xFF,
      (p_ARP >> 8) & 0xFF,
      p_hysteresis_rate,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startVVI(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP) {
    sendPacket(9 /* StartVVI */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_vent_sensitivity,
      p_VRP & 0xFF,
      (p_VRP >> 8) & 0xFF
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startVVIH(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_hysteresis_rate) {
    sendPacket(10 /* StartVVIH */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_vent_sensitivity,
      p_VRP & 0xFF,
      (p_VRP >> 8) & 0xFF,
      p_hysteresis_rate
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startVVIR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(11 /* StartVVIR */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_vent_sensitivity,
      p_VRP & 0xFF,
      (p_VRP >> 8) & 0xFF,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startVVIHR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_hysteresis_rate, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(12 /* StartVVIHR */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_vent_sensitivity,
      p_VRP & 0xFF,
      (p_VRP >> 8) & 0xFF,
      p_hysteresis_rate,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startDOO(p_pulse_rate, p_vent_width, p_vent_amplitude, p_atrial_width, p_atrial_amplitude, p_AV_delay) {
    sendPacket(13 /* StartDOO */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_atrial_width,
      p_atrial_amplitude,
      p_AV_delay & 0xFF,
      (p_AV_delay >> 8) & 0xFF
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  async startDOOR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_atrial_width, p_atrial_amplitude, p_AV_delay, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    sendPacket(14 /* StartDOOR */, [
      p_pulse_rate,
      p_vent_width,
      p_vent_amplitude,
      p_atrial_width,
      p_atrial_amplitude,
      p_AV_delay & 0xFF,
      (p_AV_delay >> 8) & 0xFF,
      p_MSR,
      p_acc_threshold & 0xFF,
      (p_acc_threshold >> 8) & 0xFF,
      p_react_time,
      p_recovery_time,
      p_response_factor
    ], handleAck);
    await new Promise(resolve => setTimeout(resolve, 10));
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  startDataCapture() {
    sendPacket(15 /* StartDataCapture */, [], handleAck);
    this.setCollectingData(true);
  }

  @Action({ rawError: true })
  stopDataCapture() {
    sendPacket(16 /* StopDataCapture */, [], handleAck);
    this.setCollectingData(false);
  }
}
