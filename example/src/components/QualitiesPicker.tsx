import * as React from 'react';
import { Button } from 'react-native-paper';
import type { Quality } from 'src/types';

type Props = {
  quality: Quality | null;
  qualities: Quality[];
  setQuality: (quality: Quality | null) => void;
};

const QualitiesPicker = ({ quality, qualities, setQuality }: Props) => (
  <>
    <Button
      mode={!quality ? 'contained' : 'outlined'}
      compact
      onPress={() => setQuality(null)}
    >
      Auto
    </Button>
    {qualities.map((qualityOption) => (
      <Button
        key={qualityOption.name}
        mode={quality === qualityOption ? 'contained' : 'outlined'}
        compact
        onPress={() => setQuality(qualityOption)}
      >
        {qualityOption.name}
      </Button>
    ))}
  </>
);

export default QualitiesPicker;
