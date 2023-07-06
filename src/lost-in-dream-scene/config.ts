import { Vector3, Quaternion } from '@dcl/sdk/math'

export const leverAndDoorTransforms = [
  {
    lever: {
      position: Vector3.create(2, 0.8, 3.22),
      rotation: Quaternion.fromEulerDegrees(0, 90, -90)
    },
    door: {
      position: Vector3.create(-0.05, 0, -3.58)
    }
  },
  {
    lever: {
      position: Vector3.create(-2.3, 0, 4.9),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    },
    door: {
      position: Vector3.create(6.25, -0.05, -0.03),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    }
  },
  {
    lever: {
      position: Vector3.create(6, 0.8, 2.2),
      rotation: Quaternion.fromEulerDegrees(180, 0, 90)
    },
    door: {
      position: Vector3.create(-3.76, 0, -9.1)
    }
  },
  {
    lever: {
      position: Vector3.create(7.7, 0.1, -2.2)
    },
    door: {
      position: Vector3.create(11.93, 0, 6.25),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0)
    }
  },
  {
    lever: {
      position: Vector3.create(1.5, 0.8, 13.7),
      rotation: Quaternion.fromEulerDegrees(0, 0, -90)
    },
    door: {
      position: Vector3.create(-0.08, 0, 11.99)
    }
  }
]
