import 'mocha';
import 'chai';
import { expect } from 'chai';
import { TfsMessage, Message } from '../../src/pubsub';

describe('packages/message-handling - pubsub', () => {
    describe('message - instantiation', () => {
        it('raw message can be instantiated with string', () => {
            const message = 'some data';

            expect(message).to.equal('some data');
        });

        it('structured message can be instantiated with correct structure', () => {
            const message: TfsMessage = {
                type: 'hello',
                data: { some: 'thing' },
            };

            expect(message).to.deep.equal({
                type: 'hello',
                data: { some: 'thing' },
            });
        });

        it('Message type can be either type of message', () => {
            const rawMessage = 'some data';

            const structureMessage: TfsMessage = {
                type: 'hello',
                data: { some: 'thing' },
            };

            const messages: Message[] = [];
            messages.push(rawMessage);
            messages.push(structureMessage);

            expect(messages).to.have.lengthOf(2);
            expect(messages[0]).to.equal('some data');
            expect(messages[1]).to.have.property('type', 'hello');
        });
    });
});
