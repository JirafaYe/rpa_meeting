package org.cuit.meeting.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Devildyw
 * @date 2025/03/30 19:45
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileDto {

    private String fileName;

    private String fileUrl;
}