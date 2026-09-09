package com.nosmoking.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nosmoking.backend.model.DailyLog;
import com.nosmoking.backend.repository.DailyLogRepository;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5179")
public class DailyLogController {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @GetMapping
    public List<DailyLog> getAllLogs() {
        return dailyLogRepository.findAll();
    }

    @PostMapping
    public DailyLog createOrUpdateLog(@RequestBody DailyLog dailyLog) {
        Optional<DailyLog> existingLog = dailyLogRepository.findByLogDate(dailyLog.getLogDate());
        if (existingLog.isPresent()) {
            DailyLog logToUpdate = existingLog.get();
            logToUpdate.setCount(dailyLog.getCount());
            return dailyLogRepository.save(logToUpdate);
        } else {
            return dailyLogRepository.save(dailyLog);
        }
    }
}