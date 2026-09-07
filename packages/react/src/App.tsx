import FitinCanvas from "./components/FitinCanvas";
import FitinContainer from "./components/FitinContainer";

export default function App() {
  return (
    <FitinCanvas designWidth={1920} designHeight={1080}>
      <FitinContainer
        designWidth={220}
        designHeight={800}
        style={{ background: "red", height: "100%" }}
      >
        1234
      </FitinContainer>
    </FitinCanvas>
  );
}
