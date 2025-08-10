import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

it("renders App without crashing", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
});
