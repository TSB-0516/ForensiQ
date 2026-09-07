package com.investigation.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.springframework.stereotype.Component;

@Component
public class CaseNumberGenerator {

    private final DataSource dataSource;

    public CaseNumberGenerator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public String generate() {
        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SELECT nextval('case_number_seq')")) {

            rs.next();
            long next = rs.getLong(1);
            return String.format("CASE-%06d", next);

        } catch (SQLException e) {
            throw new RuntimeException("Failed to generate case number", e);
        }
    }
}
