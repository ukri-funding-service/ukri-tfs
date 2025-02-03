import { BaseLogFormatter } from './baseLogFormatter';

export abstract class ServiceLogFormatter extends BaseLogFormatter {
    constructor(private serviceName: string, protected layer: string) {
        super();
    }

    protected messagePrefix(): string {
        return `${this.serviceName}:${this.layer}`;
    }
}
