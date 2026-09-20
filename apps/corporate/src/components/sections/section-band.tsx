import { Container, type ContainerProps } from '@/components/ui/container';
import { Divider } from '@/components/ui/divider';
import { Surface } from '@/components/ui/surface';
import type { Tone } from '@/lib/surface-score';
import { cn } from '@/lib/utils';

export interface SectionBandProps {
  tone: Tone;
  /** Computed by the score, never chosen here. */
  divided: boolean;
  id?: string;
  width?: ContainerProps['width'];
  className?: string;
  children: React.ReactNode;
}

/**
 * One band of the page: its surface, its hairline, its rhythm.
 *
 * The reveal sits here rather than on each child — eight items rising one after
 * another is a slideshow, not a page settling.
 */
export function SectionBand({
  tone,
  divided,
  id,
  width = 'wide',
  className,
  children,
}: SectionBandProps) {
  return (
    <Surface id={id} tone={tone === 'inverted' ? 'inverted' : 'ground'}>
      {divided ? (
        <Container width={width}>
          <Divider />
        </Container>
      ) : null}
      <Container width={width} className={cn('reveal py-section', className)}>
        {children}
      </Container>
    </Surface>
  );
}
