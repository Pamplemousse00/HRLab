function handleAAI
payload = in_rxdata(3:15);

p_pulse_rate = payload(1);
p_atrial_width = payload(2);
p_atrial_amplitude = payload(3);
p_atrial_sensitivity = payload(4);
p_ARP = bitor(uint16(payload(5)), bitshift(uint16(payload(6)), 8));

valid = (30 <= p_pulse_rate) && (p_pulse_rate <= 175) ...
     && (1 <= p_atrial_width) && (p_atrial_width <= 30) ...
     && (p_atrial_amplitude <= 50) ...
     && (p_atrial_sensitivity <= 50) ...
     && (150 <= p_ARP) && (p_ARP <= 500);

if valid
    out_pacing_mode = uint8(4); % AAI is mode 4
    out_hysteresis = false;
    out_rate_pacing = false;
    
    out_pulse_rate = p_pulse_rate;
    out_atrial_width = p_atrial_width;
    out_atrial_amplitude = p_atrial_amplitude;
    out_atrial_sensitivity = p_atrial_sensitivity;
    out_ARP = p_ARP;

    sendSuccessAck();
else
    sendInvalidParamAck();
end