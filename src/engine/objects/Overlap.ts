import PhysicObject from "./PhysicObject.ts"
import { ColliderInfo } from "./Colliders/Collider.ts"

type OverlapCallback = (
    obj1: PhysicObject,
    obj2: PhysicObject,
    collisionInfo?: ColliderInfo
) => void
type OverlapOptions = {
    triggerOnce?: boolean
    enabled?: boolean
    customCollisionHandler?: boolean
}

export default class Overlap {
    private readonly _obj1: PhysicObject
    private readonly _obj2: PhysicObject
    private readonly callback: OverlapCallback
    private _enabled: boolean
    private _triggerOnce: boolean
    private _hasTriggered: boolean
    private readonly customCollisionHandler: boolean

    constructor(
        obj1: PhysicObject,
        obj2: PhysicObject,
        callback: OverlapCallback,
        options: OverlapOptions = {}
    ) {
        this._obj1 = obj1
        this._obj2 = obj2
        this.callback = callback
        this._enabled = options.enabled ?? true
        this._triggerOnce = options.triggerOnce ?? false
        this._hasTriggered = false
        this.customCollisionHandler = options.customCollisionHandler ?? false
    }

    get enabled(): boolean {
        return this._enabled
    }

    set enabled(value: boolean) {
        this._enabled = value
    }

    get obj1(): PhysicObject {
        return this._obj1
    }

    get obj2(): PhysicObject {
        return this._obj2
    }

    get triggerOnce(): boolean {
        return this._triggerOnce
    }

    set triggerOnce(value: boolean) {
        this._triggerOnce = value
    }

    get hasTriggered(): boolean {
        return this._hasTriggered
    }

    set hasTriggered(value: boolean) {
        this._hasTriggered = value
    }

    isHappening(): ColliderInfo | null {
        if (!this._enabled) return null
        if (this._hasTriggered && this._triggerOnce) return null

        return this._obj1.collider.checkCollision(this._obj2.collider)
    }

    onOverlap(): void {
        const collisionInfo = this.isHappening()

        if (!collisionInfo) return

        if (this.customCollisionHandler) {
            this.callback(this._obj1, this._obj2, collisionInfo)
        } else {
            this.callback(this._obj1, this._obj2)
        }

        if (this.triggerOnce) {
            this.hasTriggered = true
        }
    }
}
