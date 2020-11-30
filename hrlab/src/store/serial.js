import {
  Module, VuexModule, Mutation, Action,
} from 'vuex-module-decorators';

import SerialPort from 'serialport';

@Module({
  name: 'serial',
  namespaced: true,
})
export default class SerialState extends VuexModule {
  // Public variables
  currentMode = 0;
  atrSignalReadings = [];
  ventSignalReadings = [];

  // Private variables
  port = null

  @Action({ rawError: true })
  async listPorts() {
    const ports = await SerialPort.list()
    return ports.map(x => x.path)
  }

  @Action({ rawError: true })
  connect(path) {
    // connect to serial
    this.port = new SerialPort(path, { baudRate: 115200 });
    
    // get the current mode of the pacemaker
    this.port.write(new Uint8Array([0xFE, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10, 0x01]))
    let packet = this.port.read(17);
    this.currentMode = packet[1];
  }

  @Action({ rawError: true })
  disconnect() {
    this.currentMode = 0
    this.port.close()
    this.port = null
  }

  @Action({ rawError: true })
  startAOO(p_pulse_rate, p_atrial_width, p_atrial_amplitude) {
    this.port.write(new Uint8Array([0xFE, 1, p_pulse_rate, p_atrial_width, p_atrial_amplitude, 0, 0]))
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
