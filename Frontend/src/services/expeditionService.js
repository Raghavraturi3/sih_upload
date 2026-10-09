// Expedition & Convoy Route Intelligence — Client Service Layer
// Bridges UI with REST Backend & Demo Data fallback

import {
  EXPEDITIONS_METADATA,
  STATIONS,
  CONFIGURED_ROUTES,
  ACTIVE_EXPEDITIONS,
  ROUTE_ALERTS,
  SATELLITE_COMPARISON_DATA
} from '../data/demo/expeditionsDemoData.js';
import { calculateRouteRisk } from './riskEngine.js';

class ExpeditionService {
  constructor() {
    this.metadata = { ...EXPEDITIONS_METADATA };
    this.stations = [...STATIONS];
    this.routes = JSON.parse(JSON.stringify(CONFIGURED_ROUTES));
    this.expeditions = JSON.parse(JSON.stringify(ACTIVE_EXPEDITIONS));
    this.alerts = JSON.parse(JSON.stringify(ROUTE_ALERTS));
    this.satelliteComparison = { ...SATELLITE_COMPARISON_DATA };
    this.subscribers = [];

    // Recalculate risks on initialization
    this.recalculateAllRisks();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getState()));
  }

  getState() {
    return {
      metadata: this.metadata,
      stations: this.stations,
      routes: this.routes,
      expeditions: this.expeditions,
      alerts: this.alerts,
      satelliteComparison: this.satelliteComparison
    };
  }

  recalculateAllRisks() {
    this.routes.forEach(route => {
      const riskInput = {
        visibility: route.conditions?.visibility ?? 8.0,
        windSpeed: route.conditions?.windSpeed ?? 25,
        precipitation: route.conditions?.precipitation === 'Severe Blizzard' ? 3 : (route.conditions?.precipitation?.includes('Snow') ? 2 : 0),
        snowCondition: route.conditions?.snowCondition?.includes('Whiteout') ? 3 : (route.conditions?.snowCondition?.includes('Deep') ? 3 : 1),
        surfaceChange: route.satellite?.changeDetected ? 2 : 0,
        seaIceCondition: route.type === 'SEA_ICE' ? 2 : 0,
        dataFreshness: route.isStale ? 1800 : 132
      };
      const result = calculateRouteRisk(riskInput);
      route.risk = result;
      route.status = result.status;
    });
  }

  async fetchFromBackend() {
    try {
      const res = await fetch('/api/expeditions/routes');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.routes) {
          this.routes = data.routes;
          this.recalculateAllRisks();
          this.notify();
          return true;
        }
      }
    } catch {
      // Backend not running or endpoint not yet configured; use local memory state
    }
    return false;
  }

  getRouteById(id) {
    return this.routes.find(r => r.id === id || r.code === id) || this.routes[0];
  }

  getExpeditionById(id) {
    return this.expeditions.find(e => e.id === id);
  }

  getKPIs() {
    const activeExpeditionsCount = this.expeditions.filter(e => e.status === 'ACTIVE').length;
    const plannedRoutesCount = this.routes.length;
    const requiresReviewCount = this.routes.filter(r => r.status === 'REVIEW_REQUIRED' || r.status === 'CAUTION' || r.status === 'HIGH_ATTENTION').length;
    const activeAlertsCount = this.alerts.length;

    return {
      activeExpeditions: {
        value: '08',
        subtext: '+2 this week',
        actualActive: activeExpeditionsCount
      },
      plannedRoutes: {
        value: `${plannedRoutesCount.toString().padStart(2, '0')}`,
        subtext: 'Configured Corridors'
      },
      requiresAttention: {
        value: `${requiresReviewCount.toString().padStart(2, '0')}`,
        subtext: 'Requires Attention',
        statusClass: requiresReviewCount > 0 ? 'warning' : 'nominal'
      },
      routeCoverage: {
        value: '87%',
        subtext: 'Monitored Corridor Coverage'
      },
      activeAlerts: {
        value: `${activeAlertsCount.toString().padStart(2, '0')}`,
        subtext: 'Route / Environmental Alerts',
        statusClass: activeAlertsCount > 0 ? 'danger' : 'nominal'
      }
    };
  }

  updateOperatorDecision(routeId, action) {
    const route = this.getRouteById(routeId);
    if (!route) return false;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (action === 'REASSESS') {
      // Trigger reassessment with latest sensor metrics
      this.recalculateAllRisks();
      route.history.unshift({
        date: `Today, ${timestamp}`,
        status: route.status,
        note: `Reassessment requested by operator. Current risk score: ${route.risk.score}/100.`
      });
    } else if (action === 'AUTHORIZE') {
      route.status = 'NORMAL';
      if (route.risk) route.risk.status = 'NORMAL';
      route.history.unshift({
        date: `Today, ${timestamp}`,
        status: 'NORMAL',
        note: 'Operator authorized route dispatch under enhanced visual comms protocols.'
      });
    } else if (action === 'SCHEDULE_LATER') {
      route.status = 'REVIEW_REQUIRED';
      if (route.risk) route.risk.status = 'REVIEW_REQUIRED';
      route.history.unshift({
        date: `Today, ${timestamp}`,
        status: 'REVIEW_REQUIRED',
        note: 'Dispatch postponed by mission controller pending weather window.'
      });
    }

    this.notify();
    return true;
  }
}

export const expeditionService = new ExpeditionService();
