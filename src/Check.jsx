import React from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai" // Importa los íconos de la librería

export const Check = () => {

  return (
  <>
    {calculateTotalScore() === 0 ? (
                        <AiOutlineCheckCircle
                            color="green"
                            size={55}
                            title="La suma es cero"
                        />
                    ) : (
                        <>
                            <AiOutlineCloseCircle
                                color="red"
                                size={55}
                                title="La suma no es cero"
                            />
                            <p style={{ justifyContent: "center" }}>
                                LA SUMA NO DA CERO
                            </p>
                        </>
                    )}
  </>
  )
}
