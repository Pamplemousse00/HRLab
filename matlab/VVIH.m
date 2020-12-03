function handleVVIH
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_vent_width = payload(2);
p_vent_amplitude = payload(3);
p_vent_sensitivity = payload(4);
p_VRP = bitor(uint16(payload(5)), bitshift(uint16(payload(6)), 8));

p_hysteresis_rate = payload(7);

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_vent_width) && (p_vent_width <= 30) ...
     && (p_vent_amplitude <= 50) ...
     && (p_vent_sensitivity <= 50) ...
     && (150 <= p_VRP) && (p_VRP <= 500) ...
     && (30 <= p_hysteresis_rate) && (p_hysteresis_rate <= 175);

if valid
    out_pacing_mode = uint8(3); % VVI is mode 3
    out_hysteresis = true;
    out_rate_pacing = false;
    
    out_pulse_rate = p_pulse_rate;
    out_vent_width = p_vent_width;
    out_vent_amplitude = p_vent_amplitude;
    out_vent_sensitivity = p_vent_sensitivity;
    out_VRP = p_VRP;

    out_hysteresis_rate = p_hysteresis_rate;

    sendSuccessAck();
else
    sendInvalidParamAck();
end