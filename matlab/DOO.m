function handleDOO
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_vent_width = payload(2);
p_vent_amplitude = payload(3);
p_atrial_width = payload(4);
p_atrial_amplitude = payload(5);
p_AV_delay = bitor(uint16(payload(6)), bitshift(uint16(payload(7)), 8));

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_vent_width) && (p_vent_width <= 30) ...
     && (p_vent_amplitude <= 50) ...
     && (1 <= p_atrial_width) && (p_atrial_width <= 30) ...
     && (p_atrial_amplitude <= 50) ...
     && (20 <= p_AV_delay) && (p_AV_delay <= 300);

if valid
    out_pacing_mode = uint8(5); % DOO is mode 5
    out_hysteresis = false;
    out_rate_pacing = false;
    
    out_pulse_rate = p_pulse_rate;
    out_vent_width = p_vent_width;
    out_vent_amplitude = p_vent_amplitude;
    out_atrial_width = p_atrial_width;
    out_atrial_amplitude = p_atrial_amplitude;
    out_AV_delay = p_AV_delay;
    
    sendSuccessAck();
else
    sendInvalidParamAck();
end