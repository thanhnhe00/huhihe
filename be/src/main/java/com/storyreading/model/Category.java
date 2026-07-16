package com.storyreading.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", unique = true, nullable = false, length = 100)
    private String name;

    @ManyToMany(mappedBy = "categories")
    @Builder.Default
    private List<Story> stories = new ArrayList<>();
}
