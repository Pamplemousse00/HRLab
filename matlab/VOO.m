function handleVOO
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_vent_width = payload(2);
p_vent_amplitude = payload(3);

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_vent_width) && (p_vent_width <= 30) ...
     && (p_vent_amplitude <= 50);

if valid
    out_pacing_mode = uint8(1); % VOO is mode 1
    out_hysteresis = false;
    out_rate_pacing = false;
    
    out_pulse_rate = p_pulse_rate;
    out_vent_width = p_vent_width;
    out_vent_amplitude = p_vent_amplitude;
    
    sendSuccessAck();
else
    sendInvalidParamAck();
end