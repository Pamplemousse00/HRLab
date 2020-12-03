function handleVOOR
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_vent_width = payload(2);
p_vent_amplitude = payload(3);

p_MSR = payload(4);
p_acc_threshold = bitor(uint16(payload(5)), bitshift(uint16(payload(6)), 8));
p_react_time = payload(7);
p_recovery_time = payload(8);
p_response_factor = payload(9);

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_vent_width) && (p_vent_width <= 30) ...
     && (p_vent_amplitude <= 50) ...
     && (50 <= p_MSR) && (p_MSR <= 175) ...
     && (1000 <= p_acc_threshold) && (p_acc_threshold <= 4000) ...
     && (1 <= p_react_time) && (p_react_time <= 5) ...
     && (2 <= p_recovery_time) && (p_recovery_time <= 16) ...
     && (1 <= p_response_factor) && (p_response_factor <= 16);

if valid
    out_pacing_mode = uint8(1); % VOO is mode 1
    out_hysteresis = false;
    out_rate_pacing = true;
    
    out_pulse_rate = p_pulse_rate;
    out_vent_width = p_vent_width;
    out_vent_amplitude = p_vent_amplitude;
    
    out_MSR = p_MSR;
    out_acc_threshold = p_acc_threshold;
    out_react_time = p_react_time;
    out_recovery_time = p_recovery_time;
    out_response_factor = p_response_factor;

    sendSuccessAck();
else
    sendInvalidParamAck();
end