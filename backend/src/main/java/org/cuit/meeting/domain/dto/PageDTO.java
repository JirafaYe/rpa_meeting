package org.cuit.meeting.domain.dto;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 分页结果
 * @param <T>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDTO<T> {
    /**
     * 总条数
     */
    private Long total;
    /**
     * 总页码数
     */
    private Long pages;
    /**
     * 当前页数据
     */
    private List<T> list;

    public PageDTO(Page<T> page) {
        this.total = page.getTotal();
        this.pages=page.getPages();
        this.list=page.getRecords();
    }
}
