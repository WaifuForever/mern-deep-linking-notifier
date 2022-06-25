import { hashPassword, matchPassword } from '../../../src/utils/password.util';
import { admin1, admin3 } from '../../mocks/user.mock';

const itif = (condition: boolean) => (condition ? it : it.skip);

describe('Password', () => {
    describe('should work', () => {
        it('match hash with the origin string', async () => {
            const hash = await hashPassword(admin1.password);

            expect(await matchPassword(hash, admin1.password)).toBe(true);
        });

        it('match hash with the origin string with custom salts', async () => {
            const hash = await hashPassword(admin1.password, 12);
            expect(await matchPassword(hash, admin1.password)).toBe(true);
        });
    });

    describe('should fail', () => {
        it('match hash with the wrong string', async () => {
            const hash = await hashPassword(admin1.password);
            expect(await matchPassword(hash, admin3.password)).toBe(false);
        });
    });
});
