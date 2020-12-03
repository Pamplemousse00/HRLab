function handleAAIHR
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_atrial_width = payload(2);
p_atrial_amplitude = payload(3);
p_atrial_sensitivity = payload(4);
p_ARP = bitor(uint16(payload(5)), bitshift(uint16(payload(6)), 8));

p_hysteresis_rate = payload(7);

p_MSR = payload(8);
p_acc_threshold = bitor(uint16(payload(9)), bitshift(uint16(payload(10)), 8));
p_react_time = payload(11);
p_recovery_time = payload(12);
p_response_factor = payload(13);

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_atrial_width) && (p_atrial_width <= 30) ...
     && (p_atrial_amplitude <= 50) ...
     && (p_atrial_sensitivity <= 50) ...
     && (150 <= p_ARP) && (p_ARP <= 500) ...
     && (30 <= p_hysteresis_rate) && (p_hysteresis_rate <= 175) ...
     && (50 <= p_MSR) && (p_MSR <= 175) ...
     && (1000 <= p_acc_threshold) && (p_acc_threshold <= 4000) ...
     && (1 <= p_react_time) && (p_react_time <= 5) ...
     && (2 <= p_recovery_time) && (p_recovery_time <= 16) ...
     && (1 <= p_response_factor) && (p_response_factor <= 16);

if valid
    out_pacing_mode = uint8(4); % AAI is mode 4
    out_hysteresis = true;
    out_rate_pacing = true;
    
    out_pulse_rate = p_pulse_rate;
    out_atrial_width = p_atrial_width;
    out_atrial_amplitude = p_atrial_amplitude;
    out_atrial_sensitivity = p_atrial_sensitivity;
    out_ARP = p_ARP;

    out_hysteresis_rate = p_hysteresis_rate;

    out_MSR = p_MSR;
    out_acc_threshold = p_acc_threshold;
    out_react_time = p_react_time;
    out_recovery_time = p_recovery_time;
    out_response_factor = p_response_factor;

    sendSuccessAck();
else
    sendInvalidParamAck();
end