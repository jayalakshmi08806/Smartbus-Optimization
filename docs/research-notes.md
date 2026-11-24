# SmartBus 2.0 Research & Mathematical Notes

## AI Crowd Prediction Model Formulation

Public transportation demand exhibits pronounced cyclical peaks driven by office and educational timings, coupled with spatial bottlenecks at major interchange hubs.

### 1. Temporal Demand Equations

Let $h \in [0, 23]$ represent the hour of the day and $d \in [0, 6]$ represent the day of the week (where $d \in \{0, 6\}$ corresponds to weekends).

The base occupancy ratio $O(h, d, s)$ at stop sequence position $s \in [0, 1]$ is modeled using a bimodal Gaussian mixture representing morning and evening commuter rushes:

$$O(h, d, s) = \left( O_{\text{base}} + A_m \cdot e^{-\frac{(h - \mu_m)^2}{2\sigma_m^2}} + A_e \cdot e^{-\frac{(h - \mu_e)^2}{2\sigma_e^2}} \right) \cdot W(d) \cdot S(s)$$

Where:
- $O_{\text{base}} = 0.35$ (baseline daytime transit demand)
- $\mu_m = 9.0, \sigma_m = 1.18, A_m = 0.52$ (Morning rush centered at 09:00 AM)
- $\mu_e = 18.2, \sigma_e = 1.30, A_e = 0.56$ (Evening rush centered at 06:12 PM)
- $W(d) = 0.82$ if weekend, $1.05$ if weekday
- $S(s) \in [0.75, 1.25]$ represents the stop bottleneck multiplier (e.g. Guindy Kathipara interchange $S(s) \approx 1.25$)

### 2. Crowd Level Classification Thresholds

The continuous occupancy ratio $O$ is classified into 4 operational tiers:

- **LOW**: $O < 0.40$
- **MODERATE**: $0.40 \le O < 0.70$
- **HIGH**: $0.70 \le O < 0.88$
- **VERY HIGH**: $O \ge 0.88$

### 3. Dispatch Rebalancing Formulation

When predicted demand exceeds $O_{\text{critical}} = 0.88$, short-loop shuttle injection is calculated by:

$$N_{\text{shuttle}} = \left\lceil \frac{(O - 0.70) \cdot C_{\text{route}}}{C_{\text{shuttle}}} \right\rceil$$

This optimizes passenger clearance while minimizing total circuit vehicle kilometers traveled (VKT).
