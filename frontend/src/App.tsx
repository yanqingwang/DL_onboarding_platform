import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header>
        <h1>Blue-Collar Onboarding Platform</h1>
      </header>
      <main>
        <p>Welcome to the platform</p>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </main>
    </div>
  );
}

export default App;
