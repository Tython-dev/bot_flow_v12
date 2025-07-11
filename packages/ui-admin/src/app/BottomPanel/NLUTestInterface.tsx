import { Button, Card, Intent, NonIdealState } from '@blueprintjs/core'
import React, { FC, useState, useEffect } from 'react'
import style from './style.scss'

interface NLUTestProps {
  botId?: string
}

interface PredictionResult {
  text: string
  intent: string
  confidence: number
  entities: any[]
  language: string
  timestamp: Date
}

const NLUTestInterface: FC<NLUTestProps> = ({ botId }) => {
  const [inputText, setInputText] = useState('')
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testNLU = async () => {
    if (!inputText.trim()) {
      return
    }

    setIsLoading(true)
    try {
      // Simulation d'un appel API NLU
      const mockResult: PredictionResult = {
        text: inputText,
        intent: 'mock_intent',
        confidence: Math.random() * 0.4 + 0.6, // Entre 0.6 et 1.0
        entities: [
          { name: 'test_entity', value: 'example', confidence: 0.95 }
        ],
        language: 'fr',
        timestamp: new Date()
      }

      setPredictions(prev => [mockResult, ...prev.slice(0, 9)]) // Garder 10 derniers résultats
      setInputText('')
    } catch (error) {
      console.error('Erreur lors du test NLU:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void testNLU()
    }
  }

  return (
    <div className="nlu-test-interface">
      <Card elevation={1} style={{ marginBottom: '20px' }}>
        <h4>🧠 Test NLU en Direct</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message pour tester le NLU..."
            style={{
              flex: 1,
              minHeight: '60px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <Button
            onClick={testNLU}
            intent={Intent.PRIMARY}
            loading={isLoading}
            disabled={!inputText.trim()}
          >
            Tester
          </Button>
        </div>
        {botId && (
          <small style={{ color: '#666' }}>
            Bot actuel: <strong>{botId}</strong>
          </small>
        )}
      </Card>

      <div className="predictions">
        {predictions.length === 0 ? (
          <NonIdealState
            icon="search-text"
            title="Aucun test effectué"
            description="Tapez un message ci-dessus pour tester le NLU"
          />
        ) : (
          predictions.map((pred, index) => (
            <Card key={index} elevation={0} style={{ marginBottom: '15px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong>"{pred.text}"</strong>
                <small style={{ color: '#666' }}>
                  {pred.timestamp.toLocaleTimeString()}
                </small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div><strong>Intent:</strong> {pred.intent}</div>
                  <div><strong>Confiance:</strong> {(pred.confidence * 100).toFixed(1)}%</div>
                  <div><strong>Langue:</strong> {pred.language}</div>
                </div>

                <div>
                  <strong>Entités:</strong>
                  {pred.entities.length > 0 ? (
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                      {pred.entities.map((entity, idx) => (
                        <li key={idx}>
                          {entity.name}: {entity.value} ({(entity.confidence * 100).toFixed(1)}%)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#666', fontStyle: 'italic' }}> Aucune</span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default NLUTestInterface
