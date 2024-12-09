OctoPerf PetStore Load Test Plan Overview.
This repository contains the load testing plan and results for the OctoPerf PetStore Performance Monitoring project. The test aimed to evaluate system stability, scalability, and resource utilization under a simulated load of 300 concurrent users over a 60-minute period.

Test Summary:
Test Website: OctoPerf PetStore
Total Duration: ~60 minutes
Virtual Concurrent Users: 300
Test Type: Load Test


Key Metrics
Memory Usage:
Committed Bytes in Use: Average: 63.7%, Max: 80.97%
Available Bytes: Average: ~1.31 GB, Min: ~449 MB, Max: ~2.72 GB

Network Performance:
Bytes Received/sec: Average: ~8.13 MB/s, Max: ~15.5 MB/s
Bytes Sent/sec: Average: ~904 KB/s, Max: ~1.08 MB/s

Processor and Disk Usage:
% Processor Time: Average: ~4.2%, Max: 27.1%
% Disk Time: Average: ~8.3%, Max: 300.8%
Disk Reads/sec: Average: ~46.3, Max: ~2.86M
Disk Writes/sec: Average: ~43.5, Max: ~4.99M

Response Times:
Min: 25 ms
Max: ~1.11 seconds
Avg: ~33.6 ms
Percentiles:
90th: 34 ms
95th: 35 ms
99th: 257 ms

Throughput:
Hits/Second: ~1.96K req/s
Transactions Per Second (TPS): ~1.95K req/s

Observations:
Disk utilization spikes were observed, with peaks exceeding 300% in % Disk Time, indicating potential bottlenecks during intensive operations.
All 4 errors occurred during ClickOnConfirm transactions, resulting in HTTP 500 (Internal Server Error).
Recommendations:
Disk Utilization: Investigate and address high disk time peaks to improve performance during peak loads.
Server-Side Errors: Examine server logs to resolve the HTTP 500 errors on the ClickOnConfirm transaction.
Scalability: Monitor network throughput and optimize system scalability for increasing user loads.

How to Run the Test:
Clone this repository to your local environment.
Install the necessary tools:
Apache JMeter (Version 5.6.3 recommended)
Load the test plan (PetStore.jmx) in JMeter.
Configure user load and duration as needed (default: 300 users, 60 minutes).
Run the test and analyze results.

Contributors:
George Petre
Email: george.petre23@gmail.com
GitHub: georgempetre.github.io
