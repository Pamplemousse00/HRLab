function sendCurrentModePacket
% default to unknown mode ack
out_packet_data = [
    uint8(0xFE); % start byte
    uint8(19); % ack packet type
    uint8(18); % requestings packet's type (GetCurrentMode)
    uint8(3); % response code of 3 means unknown mode

    % unused payload section
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);
    uint8(0);

    uint8(0); % checksum LSB
    uint8(0); % checksum MSB
];

if out_pacing_mode == 1 % VOO*
    if ~out_hysteresis && ~out_rate_pacing % VOO
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(3); % StartVOO packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif ~out_hysteresis && out_rate_pacing % VOOR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(4); % StartVOOR packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    end
elseif out_pacing_mode == 2 % AOO*
    if ~out_hysteresis && ~out_rate_pacing % AOO
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(1); % StartAOO packet type

            uint8(out_pulse_rate);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif ~out_hysteresis && out_rate_pacing % AOOR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(2); % StartAOOR packet type

            uint8(out_pulse_rate);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    end
elseif out_pacing_mode == 3 % VVI*
    if ~out_hysteresis && ~out_rate_pacing % VVI
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(9); % StartVVI packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_vent_sensitivity);
            uint8(bitand(out_VRP, 0x00FF));
            uint8(bitand(bitshift(out_VRP, -8), 0x00FF));
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif out_hysteresis && ~out_rate_pacing % VVIH
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(10); % StartVVIH packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_vent_sensitivity);
            uint8(bitand(out_VRP, 0x00FF));
            uint8(bitand(bitshift(out_VRP, -8), 0x00FF));
            uint8(out_hysteresis_rate);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif ~out_hysteresis && out_rate_pacing % VVIR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(11); % StartVVIR packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_vent_sensitivity);
            uint8(bitand(out_VRP, 0x00FF));
            uint8(bitand(bitshift(out_VRP, -8), 0x00FF));
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif out_hysteresis && out_rate_pacing % VVIHR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(12); % StartVVIHR packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_vent_sensitivity);
            uint8(bitand(out_VRP, 0x00FF));
            uint8(bitand(bitshift(out_VRP, -8), 0x00FF));
            uint8(out_hysteresis_rate);
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    end
elseif out_pacing_mode == 4 % AAI*
    if ~out_hysteresis && ~out_rate_pacing % AAI
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(5); % StartAAI packet type

            uint8(out_pulse_rate);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(out_atrial_sensitivity);
            uint8(bitand(out_ARP, 0x00FF));
            uint8(bitand(bitshift(out_ARP, -8), 0x00FF));
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif out_hysteresis && ~out_rate_pacing % AAIH
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(6); % StartAAIH packet type

            uint8(out_pulse_rate);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(out_atrial_sensitivity);
            uint8(bitand(out_ARP, 0x00FF));
            uint8(bitand(bitshift(out_ARP, -8), 0x00FF));
            uint8(out_hysteresis_rate);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif ~out_hysteresis && out_rate_pacing % AAIR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(7); % StartAAIR packet type

            uint8(out_pulse_rate);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(out_atrial_sensitivity);
            uint8(bitand(out_ARP, 0x00FF));
            uint8(bitand(bitshift(out_ARP, -8), 0x00FF));
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif out_hysteresis && out_rate_pacing % AAIHR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(8); % StartAAIHR packet type

            uint8(out_pulse_rate);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(out_atrial_sensitivity);
            uint8(bitand(out_ARP, 0x00FF));
            uint8(bitand(bitshift(out_ARP, -8), 0x00FF));
            uint8(out_hysteresis_rate);
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    end
elseif out_pacing_mode == 5 % DOO*
    if ~out_hysteresis && ~out_rate_pacing % DOO
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(13); % StartDOO packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(bitand(out_AV_delay, 0x00FF));
            uint8(bitand(bitshift(out_AV_delay, -8), 0x00FF));
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);
            uint8(0);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    elseif ~out_hysteresis && out_rate_pacing % DOOR
        out_packet_data = [
            uint8(0xFE); % start byte
            uint8(14); % StartDOOR packet type

            uint8(out_pulse_rate);
            uint8(out_vent_width);
            uint8(out_vent_amplitude);
            uint8(out_atrial_width);
            uint8(out_atrial_amplitude);
            uint8(bitand(out_AV_delay, 0x00FF));
            uint8(bitand(bitshift(out_AV_delay, -8), 0x00FF));
            uint8(out_MSR);
            uint8(bitand(out_acc_threshold, 0x00FF));
            uint8(bitand(bitshift(out_acc_threshold, -8), 0x00FF));
            uint8(out_react_time);
            uint8(out_recovery_time);
            uint8(out_response_factor);

            uint8(0); % checksum LSB
            uint8(0); % checksum MSB
        ];  
    end
end

sendPacketWithChecksum();
