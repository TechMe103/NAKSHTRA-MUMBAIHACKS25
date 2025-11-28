# Financial Health Tree System

A visual representation of a user's financial health using a tree metaphor, where the tree's appearance changes based on financial metrics.

## Features

- **Real-time Financial Health Scoring** (0-100)
- **Interactive 3D Tree Visualization**
  - Trunk thickness represents income stability
  - Branch length shows income-expense ratio
  - Leaf count and color reflect savings rate
  - Flowers and fruits indicate financial achievements
- **Responsive Dashboard** with key financial metrics
- **Animations** for financial changes and milestones

## Architecture

### Backend (Python/FastAPI)
- `financial_health.py`: Core logic for financial health calculation
- `routes/financial_health.py`: API endpoints for the service

### Frontend (React/TypeScript/Three.js)
- `TreeVisualization.tsx`: 3D tree visualization component
- `FinancialHealthDashboard.tsx`: Dashboard component with metrics
- `types/financialHealth.ts`: TypeScript type definitions

## Setup Instructions

### Backend Setup

1. Install dependencies:
   ```bash
   pip install fastapi uvicorn python-multipart pydantic
   ```

2. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontendnew
   npm install three @react-three/fiber @react-three/drei
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/financial-health/analyze` - Analyze financial data
- `GET /api/financial-health/{user_id}` - Get financial health data

## Usage Example

```typescript
// Example API call to analyze financial health
const analyzeFinancialHealth = async (userId: string, metrics: FinancialMetrics) => {
  const response = await fetch('/api/financial-health/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, metrics })
  });
  return await response.json();
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
