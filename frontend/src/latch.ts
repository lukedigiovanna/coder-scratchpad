class Latch {
    private promise: Promise<void>;
    private releaseFn!: () => void;

    constructor() {
        this.promise = new Promise<void>((resolve) => {
            this.releaseFn = resolve;
        });
    }

    public wait(): Promise<void> {
        return this.promise;
    }

    public release(): void {
        this.releaseFn(); // Resolve the promise, unblocking all waiting code
    }
}

export { Latch };

