package site.dlink.pairing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class YangjuPairingRequest {
    private String korName;
    private String engName;
    private String origin;
    private String percent;
    private String volume;
    private String price;
    private String explanation;
    private String category;

}
