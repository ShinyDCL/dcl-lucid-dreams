import { Entity, engine, Transform, MeshRenderer, Material } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { sceneSize } from './resources'

export const createSkyBox = (parent: Entity, folderName: string): Entity => {
  const folderPath = `images/skybox/${folderName}`
  const defaultScale = Vector3.create(sceneSize, sceneSize, sceneSize)
  const skyBoxRoot = engine.addEntity()
  Transform.create(skyBoxRoot, { parent })

  //front
  const skyBoxPZ = engine.addEntity()
  Transform.create(skyBoxPZ, {
    position: Vector3.create(0, 0, sceneSize / 2),
    scale: defaultScale,
    parent: skyBoxRoot
  })
  MeshRenderer.setPlane(skyBoxPZ)
  Material.setBasicMaterial(skyBoxPZ, { texture: Material.Texture.Common({ src: `${folderPath}/pz.jpg` }) })

  //back
  const skyBoxNZ = engine.addEntity()
  Transform.create(skyBoxNZ, {
    position: Vector3.create(0, 0, -sceneSize / 2),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: defaultScale,
    parent: skyBoxRoot
  })
  MeshRenderer.setPlane(skyBoxNZ)
  Material.setBasicMaterial(skyBoxNZ, { texture: Material.Texture.Common({ src: `${folderPath}/nz.jpg` }) })

  //Top
  const skyBoxPY = engine.addEntity()
  Transform.create(skyBoxPY, {
    position: Vector3.create(0, sceneSize / 2, 0),
    rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
    scale: defaultScale,
    parent: skyBoxRoot
  })
  MeshRenderer.setPlane(skyBoxPY)
  Material.setBasicMaterial(skyBoxPY, { texture: Material.Texture.Common({ src: `${folderPath}/py.jpg` }) })

  //Bottom
  const skyBoxNY = engine.addEntity()
  Transform.create(skyBoxNY, {
    position: Vector3.create(0, -sceneSize / 2, 0),
    rotation: Quaternion.fromEulerDegrees(90, 0, 0),
    scale: defaultScale,
    parent: skyBoxRoot
  })
  MeshRenderer.setPlane(skyBoxNY)
  Material.setBasicMaterial(skyBoxNY, { texture: Material.Texture.Common({ src: `${folderPath}/ny.jpg` }) })

  //Right
  const skyBoxPX = engine.addEntity()
  Transform.create(skyBoxPX, {
    position: Vector3.create(sceneSize / 2, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, 90, 0),
    scale: defaultScale,
    parent: skyBoxRoot
  })
  MeshRenderer.setPlane(skyBoxPX)
  Material.setBasicMaterial(skyBoxPX, { texture: Material.Texture.Common({ src: `${folderPath}/px.jpg` }) })

  // Left
  const skyBoxNX = engine.addEntity()
  Transform.create(skyBoxNX, {
    position: Vector3.create(-sceneSize / 2, 0, 0),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0),
    scale: defaultScale,
    parent: skyBoxRoot
  })
  MeshRenderer.setPlane(skyBoxNX)
  Material.setBasicMaterial(skyBoxNX, { texture: Material.Texture.Common({ src: `${folderPath}/nx.jpg` }) })

  return skyBoxRoot
}
