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
  console.log(rxdata)

  rxdata.forEach(b => {  
    currPacket.push(b)
    
    if(currPacket.length == 17) {
      console.log("Packet", currPacket)

      const recvChecksum = ((currPacket[16] << 8) | currPacket[15]);
      
      let calculatedChecksum = 0
      for(let i = 0; i < 15; i++) {
        calculatedChecksum = (calculatedChecksum + currPacket[i]) & 0xFFFF;
      }
      
      const valid = (currPacket[0] == 0xFE) && (recvChecksum == calculatedChecksum);
      if(!valid) {
        console.log(`Invalid. ${currPacket[0]} != 0xFE or checksum ${calculatedChecksum} != ${recvChecksum}`);
      } else {
        console.log(`Valid checksum ${calculatedChecksum} == ${recvChecksum}`);
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

  console.log(payload)

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
  atrSignalReadings = [];
  ventSignalReadings = [];

  @Action({ rawError: true })
  async listPorts() {
    const ports = await SerialPort.list()
    return ports.map(x => x.path)
  }

  @Mutation
  setCurrentMode(mode) {
    this.currentMode = mode;
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
  }

  @Action({ rawError: true })
  disconnect() {
    this.setCurrentMode(0)
    
    port.close()
    port = null
  }

  @Action({ rawError: true })
  startAOO({p_pulse_rate, p_atrial_width, p_atrial_amplitude}) {
    sendPacket(1 /* StartAOO */, [p_pulse_rate, p_atrial_width, p_atrial_amplitude], handleAck);
    sendPacket(18 /* GetCurrentMode */, [], packet => {
      console.log(PacketTypeNames[packet[1]]);
      this.setCurrentMode(packet[1]);
    })
  }

  @Action({ rawError: true })
  startAOOR(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 2, p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor, 0, 0]))
  }

  @Action({ rawError: true })
  startVOO(p_pulse_rate, p_vent_width, p_vent_amplitude) {
    this.port.write(new Uint8Array([0xFE, 3, p_pulse_rate, p_vent_width, p_vent_amplitude, 0, 0]))
  }

  @Action({ rawError: true })
  startVOOR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 4, p_pulse_rate, p_vent_width, p_vent_amplitude, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor, 0, 0]))
  }

  @Action({ rawError: true })
  startAAI(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP) {
    this.port.write(new Uint8Array([0xFE, 5, p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, 0, 0]))
  }

  @Action({ rawError: true })
  startAAIH(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_hysteresis_rate) {
    this.port.write(new Uint8Array([0xFE, 6, p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_hysteresis_rate, 0, 0]))
  }

  @Action({ rawError: true })
  startAAIR(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 7, p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor, 0, 0]))
  }
  
  @Action({ rawError: true })
  startAAIHR(p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_hysteresis_rate, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 8, p_pulse_rate, p_atrial_width, p_atrial_amplitude, p_atrial_sensitivity, p_ARP, p_hysteresis_rate, 0, 0]))
  }

  @Action({ rawError: true })
  startVVI(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP) {
    this.port.write(new Uint8Array([0xFE, 9, p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, 0, 0]))
  }

  @Action({ rawError: true })
  startVVIH(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_hysteresis_rate) {
    this.port.write(new Uint8Array([0xFE, 10, p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_hysteresis_rate, 0, 0]))
  }

  @Action({ rawError: true })
  startVVIR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 11, p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor, 0, 0]))
  }

  @Action({ rawError: true })
  startVVIHR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_hysteresis_rate, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 12, p_pulse_rate, p_vent_width, p_vent_amplitude, p_vent_sensitivity, p_VRP, p_hysteresis_rate, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor, 0, 0]))
  }

  @Action({ rawError: true })
  startDOO(p_pulse_rate, p_vent_width, p_vent_amplitude, p_atrial_width, p_atrial_amplitude, p_AV_delay) {
    this.port.write(new Uint8Array([0xFE, 13, p_pulse_rate, p_vent_width, p_vent_amplitude, p_atrial_width, p_atrial_amplitude, p_AV_delay, 0, 0]))
  }

  @Action({ rawError: true })
  startDOOR(p_pulse_rate, p_vent_width, p_vent_amplitude, p_atrial_width, p_atrial_amplitude, p_AV_delay, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor) {
    this.port.write(new Uint8Array([0xFE, 14, p_pulse_rate, p_vent_width, p_vent_amplitude, p_atrial_width, p_atrial_amplitude, p_AV_delay, p_MSR, p_acc_threshold, p_react_time, p_recovery_time, p_response_factor, 0, 0]))
  }

  @Action({ rawError: true })
  startDataCapture() {
    this.port.write(new Uint8Array([0xFE, 15, 0, 0]))
  }

  @Action({ rawError: true })
  stopDataCapture() {
    this.port.write(new Uint8Array([0xFE, 16, 0, 0]))
  }
}
