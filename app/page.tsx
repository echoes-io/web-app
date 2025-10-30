export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold">Echoes</h1>
        
        <p className="text-lg text-muted-foreground">
          Una piattaforma per esplorare storie interconnesse attraverso timeline parallele.
        </p>

        <div className="space-y-4">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Cos'è Echoes?</h2>
            <p className="text-muted-foreground">
              Echoes è un progetto narrativo che organizza contenuti in una struttura gerarchica:
              Timeline → Archi → Episodi → Parti → Capitoli. Ogni elemento racconta una parte
              della storia, permettendo di esplorare diverse prospettive e linee temporali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Struttura</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Timeline</strong>: Container principale della storia</li>
              <li><strong>Arc</strong>: Arco narrativo all'interno di una timeline</li>
              <li><strong>Episode</strong>: Episodio che sviluppa l'arco</li>
              <li><strong>Part</strong>: Parte di un episodio</li>
              <li><strong>Chapter</strong>: Capitolo con contenuto e metadata</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
