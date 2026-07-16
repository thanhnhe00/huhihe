package com.storyreading.repository;

import com.storyreading.model.ThemeCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThemeCollectionRepository extends JpaRepository<ThemeCollection, Long> {
    Optional<ThemeCollection> findByNameIgnoreCase(String name);
}
