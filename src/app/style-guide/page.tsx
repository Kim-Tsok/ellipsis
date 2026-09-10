import Logo from '@/components/Logo';
import BackgroundTexture from '@/components/BackgroundTexture';
import GradientOrb from '@/components/GradientOrb';

export default function StyleGuide() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-instrument mb-6">Style Guide</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-instrument mb-4">Fonts</h2>
        <div className="grid gap-4">
          <div className="font-instrument">
            <p className="italic">Instrument Serif Italic</p>
            <p>Instrument Serif Regular</p>
          </div>
          <div className="font-crimson">
            <p>Crimson Text</p>
          </div>
          <div className="font-space">
            <p>Space Grotesk (UI chrome)</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-instrument mb-4">Colors</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-400 rounded"></div>
            <p className="text-center text-xs">Brand (teal-400)</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-300 rounded"></div>
            <p className="text-center text-xs">Tint (teal-300)</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-600 rounded"></div>
            <p className="text-center text-xs">Shade (teal-600)</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-ink rounded"></div>
            <p className="text-center text-xs">Ink</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-paper rounded"></div>
            <p className="text-center text-xs">Paper</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-mist rounded"></div>
            <p className="text-center text-xs">Mist</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-line rounded"></div>
            <p className="text-center text-xs">Line</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-instrument mb-4">Logo</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-space text-sm">Full Logo</p>
            <div className="flex space-x-4">
              <Logo variant="full" size="sm" className="text-teal-600" />
              <Logo variant="full" size="md" className="text-teal-600" />
              <Logo variant="full" size="lg" className="text-teal-600" />
            </div>
          </div>
          <div>
            <p className="font-space text-sm">Mark Only</p>
            <div className="flex space-x-4">
              <Logo variant="mark" size="sm" className="text-teal-600" />
              <Logo variant="mark" size="md" className="text-teal-600" />
              <Logo variant="mark" size="lg" className="text-teal-600" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-instrument mb-4">Background Texture</h2>
        <div className="relative h-48 bg-mist">
          <BackgroundTexture className="absolute inset-0 opacity-20" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-instrument mb-4">Gradient Orb</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-space text-sm">App Variant</p>
            <div className="relative h-48 w-64 bg-mist">
              <GradientOrb variant="app" className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-32" />
            </div>
          </div>
          <div>
            <p className="font-space text-sm">Password Variant</p>
            <div className="relative h-48 w-64 bg-mist">
              <GradientOrb variant="password" className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-32" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
