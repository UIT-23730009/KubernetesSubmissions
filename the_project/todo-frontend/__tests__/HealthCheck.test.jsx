/**
 * @file ServerHealthCheck.test.jsx
 * @description Jest + React Testing Library TDD for ServerHealthCheck component
 */

import React from "react";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import ServerHealthCheck from "../src/serverHealthCheck.jsx";

jest.mock("axios"); // mock all axios calls

describe("🧩 ServerHealthCheck Component", () => {
  const mockRootData = {
    name: "Todo API",
    version: "1.4.0",
    description: "Simple API root response",
  };

  const mockHealthData = {
    status: "ok",
    uptime: "1234s",
    checks: {
      db: "connected",
      redis: "connected",
      api_latency_ms: 23,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------
  it("renders loading state initially", async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // pending promise

    render(<ServerHealthCheck />);

    expect(screen.getByText(/Loading API data/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  it("renders API root and health data when fetch succeeds", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockRootData }) // for /api/v1.4
      .mockResolvedValueOnce({ data: mockHealthData }); // for /api/v1.4/health

    render(<ServerHealthCheck />);

    // Wait for data to load and render
    await waitFor(() => {
      expect(screen.getByText(/API v1.4 Root/i)).toBeInTheDocument();
      expect(screen.getByText(/API v1.4 Health/i)).toBeInTheDocument();
    });

    // Root Data checks
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText(/Todo API/i)).toBeInTheDocument();
    expect(screen.getByText(/1.4.0/i)).toBeInTheDocument();

    // Health Data checks
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/ok/i)).toBeInTheDocument();
    expect(screen.getByText(/db/i)).toBeInTheDocument();
    expect(screen.getByText(/redis/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  it("renders error state when API fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<ServerHealthCheck />);

    await waitFor(() => {
      expect(screen.getByText(/❌ Error/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  it("renders empty state correctly if health data missing", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockRootData }) // /api/v1.4 success
      .mockResolvedValueOnce({ data: null }); // /api/v1.4/health empty

    render(<ServerHealthCheck />);

    await waitFor(() => {
      expect(screen.getByText(/No health data available/i)).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------
  it("renders nested table rows for complex health data", async () => {
    const complexHealthData = {
      status: "ok",
      metrics: {
        cpu: { usage: "12%", temp: "47C" },
        memory: { usage: "60%", free: "2GB" },
      },
    };

    axios.get
      .mockResolvedValueOnce({ data: mockRootData }) // /api/v1.4
      .mockResolvedValueOnce({ data: complexHealthData }); // /api/v1.4/health

    render(<ServerHealthCheck />);

    expect(await screen.findByText("cpu")).toBeInTheDocument();
    expect(screen.getAllByText("usage")).toHaveLength(2);
    expect(await screen.findByText("12%")).toBeInTheDocument();
    expect(await screen.findByText("60%")).toBeInTheDocument();
    expect(await screen.findByText("memory")).toBeInTheDocument();
  });
});
