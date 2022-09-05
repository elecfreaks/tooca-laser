import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import ParameterOutput from './components/ParameterOutput/ParameterOutput';
import ConfigurationSelect from './components/ConfigurationSelect/ConfigurationSelect';
import ConfigurationRadio from './components/ConfigurationRadio/ConfigurationRadio';
import AreaHeader from './components/AreaHeader/AreaHeader';
import NavBar from './components/NavBar/NavBar';

import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';

import lasersMetadata from "./lasers-metadata.json";

type Materials = Map<string, string[]>;
type ModesMaterialsThicknesses = Map<string, Materials>;
type MenuData = Map<
  string,
  {
    laserPowers: string[];
    engravingSizes: string[];
    modesMaterialsThicknesses: ModesMaterialsThicknesses;
  }
>;
type RecommendedParameters = Map<
  string,
  {
    power: string,
    speed: string,
    passes: string,
  }
>;

function getMenuData(metadata: typeof lasersMetadata) {
  const menuData: MenuData = new Map();

  metadata.forEach(laserMetadata => {
    const laserPowers: Set<string> = new Set();
    const engravingSizes: Set<string> = new Set();
    const processingModes: Set<string> = new Set();
    const materials: Materials = new Map();
    const thicknesses: Set<string> = new Set();
    const modesMaterialsThicknesses: ModesMaterialsThicknesses = new Map();

    laserMetadata.forEach(item => {
      laserPowers.add(item.laserPower);
      engravingSizes.add(item.engravingSize);

      const mode = item.processingMode;
      if (Array.from(processingModes)[processingModes.size - 1] !== mode) {
        materials.clear();
      }
      processingModes.add(mode);

      const material = item.material;
      if (Array.from(materials.keys())[materials.size - 1] !== material) {
        thicknesses.clear();
      }
      thicknesses.add(item.thickness);
      materials.set(material, Array.from(thicknesses));
      modesMaterialsThicknesses.set(mode, new Map(materials));
    });

    menuData.set(laserMetadata[0].model, {
      laserPowers: Array.from(laserPowers),
      engravingSizes: Array.from(engravingSizes),
      modesMaterialsThicknesses,
    });
  });

  return menuData;
}

function getRecommendedParameters(metadata: typeof lasersMetadata) {
  const parameters: RecommendedParameters = new Map();

  metadata.forEach(laserMetadata => {
    laserMetadata.forEach(item => {
      const {
        model,
        laserPower,
        engravingSize,
        processingMode,
        material,
        thickness,
        recommendedPower,
        recommendedWorkSpeed,
        passes,
      } = item;
      parameters.set(
        `${model}${laserPower}${engravingSize}${processingMode}${material}${thickness}`,
        {
          power: recommendedPower,
          speed: recommendedWorkSpeed,
          passes: passes,
        });
    });
  });

  return parameters;
}

const menuData = getMenuData(lasersMetadata);
const recommendedParameters = getRecommendedParameters(lasersMetadata);

function App() {
  // Configurations
  const [laserModels, setLaserModels] = useState<string[]>([]);
  const [laserPowers, setLaserPowers] = useState<string[]>([]);
  const [engravingSizes, setEngravingSizes] = useState<string[]>([]);
  const [processingModes, setProcessingModes] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [thicknesses, setThicknesses] = useState<string[]>([]);

  // Selected configuration
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedPower, setSelectedPower] = useState('');
  const [selectedEngravingSize, setSelectedEngravingSize] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedThickness, setSelectedThickness] = useState('');

  // Recommended parameters
  const [recommendedPower, setRecommendedPower] = useState('0');
  const [recommendedSpeed, setRecommendedSpeed] = useState('0');
  const [recommendedPasses, setRecommendedPasses] = useState('0');

  useEffect(() => {
    setLaserModels(Array.from(menuData.keys()));
  }, []);
  useEffect(() => {
    setSelectedModel(laserModels[0] ?? '');
  }, [laserModels]);

  useEffect(() => {
    const { laserPowers, engravingSizes, modesMaterialsThicknesses } = menuData.get(selectedModel) ?? {};
    setLaserPowers(laserPowers ?? []);
    setSelectedPower(laserPowers?.[0] ?? '');
    setEngravingSizes(engravingSizes ?? []);
    setSelectedEngravingSize(engravingSizes?.[0] ?? '');

    const modes = Array.from(modesMaterialsThicknesses?.keys() ?? []);
    setProcessingModes(modes);
    setSelectedMode(modes[0] ?? '');
  }, [selectedModel]);

  useEffect(() => {
    const { modesMaterialsThicknesses } = menuData.get(selectedModel) ?? {};
    const materials = Array.from(modesMaterialsThicknesses?.get(selectedMode)?.keys() ?? []);
    setMaterials(materials);
    setSelectedMaterial(materials[0] ?? '');
  }, [selectedModel, selectedMode]);

  useEffect(() => {
    const { modesMaterialsThicknesses } = menuData.get(selectedModel) ?? {};
    const thicknesses = modesMaterialsThicknesses?.get(selectedMode)?.get(selectedMaterial) ?? [];
    setThicknesses(thicknesses);
    setSelectedThickness(thicknesses[0] ?? '');
  }, [selectedModel, selectedMode, selectedMaterial]);

  useEffect(() => {
    const { power, speed, passes } = recommendedParameters.get(
      `${selectedModel}${selectedPower}${selectedEngravingSize}${selectedMode}${selectedMaterial}${selectedThickness}`
    ) ?? {
      power: '0',
      speed: '0',
      passes: '0',
    };
    setRecommendedPower(power);
    setRecommendedSpeed(speed);
    setRecommendedPasses(passes);
  }, [selectedModel, selectedPower, selectedEngravingSize, selectedMode, selectedMaterial, selectedThickness]);

  return (
    <Container>
      <NavBar />
      <AreaHeader text="Device Configurations" />
      <Card variant="outlined">
        <Grid container spacing={1} padding={1} pt={3}>
          <Grid item xs={5}>
            <ConfigurationSelect
              id="laser-model-select"
              label="Laser Model"
              items={laserModels}
              value={selectedModel}
              disabled={laserModels.length < 2}
              onChange={(model) => {
                setSelectedModel(model);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <ConfigurationSelect
              id="laser-power-select"
              label="Laser Power"
              items={laserPowers}
              value={selectedPower}
              disabled={laserPowers.length < 2}
              onChange={(power) => {
                setSelectedPower(power);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <ConfigurationSelect
              id="engraving-size-select"
              label="Engraving Size"
              items={engravingSizes}
              value={selectedEngravingSize}
              disabled={engravingSizes.length < 2}
              onChange={(size) => {
                setSelectedEngravingSize(size);
              }}
            />
          </Grid>
          <Grid item xs={6} mt={3}>
            <ConfigurationRadio
              label="Processing Mode"
              row
              items={processingModes}
              value={selectedMode}
              onChange={(mode) => {
                setSelectedMode(mode);
              }}
            />
          </Grid>
        </Grid>
      </Card>
      <AreaHeader text="Material Configurations" />
      <Card variant="outlined">
        <Grid container spacing={2} padding={2}>
          <Grid item xs={7}>
            <ConfigurationSelect
              id="material-size-select"
              label="Material"
              items={materials}
              value={selectedMaterial}
              disabled={materials.length < 2}
              onChange={(material) => {
                setSelectedMaterial(material);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <ConfigurationSelect
              id="thickness-size-select"
              label="Thickness"
              items={thicknesses}
              value={selectedThickness}
              disabled={thicknesses.length < 2}
              onChange={(thickness) => {
                setSelectedThickness(thickness);
              }}
            />
          </Grid>
        </Grid>
      </Card>
      <AreaHeader text="Recommended Parameters" />
      <Card variant="outlined">
        <Grid container spacing={2} padding={2}>
          <Grid item xs={7}>
            <ParameterOutput label="Power" icon={<BoltIcon />} value={recommendedPower} unit="%" />
          </Grid>
          <Grid item xs={7}>
            <ParameterOutput label="Speed" icon={<SpeedIcon />} value={recommendedSpeed} unit="mm/min" />
          </Grid>
          <Grid item xs={7}>
            <ParameterOutput label="Passes" icon={<LoopIcon />} value={recommendedPasses} unit="times" />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default App;
