function handleAOO
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_atrial_width = payload(2);
p_atrial_amplitude = payload(3);

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_atrial_width) && (p_atrial_width <= 30) ...
     && (p_atrial_amplitude <= 50);

if valid
    out_pacing_mode = uint8(2); % AOO is mode 2
    out_hysteresis = false;
    out_rate_pacing = false;
    
    out_pulse_rate = p_pulse_rate;
    out_atrial_width = p_atrial_width;
    out_atrial_amplitude = p_atrial_amplitude;
    
    sendSuccessAck();
else
    sendInvalidParamAck();
end