import { expect } from 'chai';
import { Role, RoleType, User } from '../../../src/auth';
import { userHasRole, userHasRoles } from '../../../src/auth/role/userRoles';

describe('User Role Service Tests', () => {
    describe('userHasRole', async () => {
        it('should return true if user has the role specified', async () => {
            const user = {
                id: 1,
                roles: [{ name: RoleType.TfsAdmin }],
            } as User;

            const hasRole = userHasRole(user, RoleType.TfsAdmin);

            return expect(hasRole).to.be.true;
        });

        it('should return false if user has no roles', async () => {
            const user = { roles: [] } as unknown as User;

            const hasRole = userHasRole(user, RoleType.TfsAdmin);

            return expect(hasRole).to.be.false;
        });

        it('should return false if user does not have the specific role requested', async () => {
            const user = {
                roles: [{ name: 2 as unknown as RoleType }],
            } as User;

            const hasRole = userHasRole(user, RoleType.TfsAdmin);

            return expect(hasRole).to.be.false;
        });
    });

    describe('userHasRoles', async () => {
        const adminRole = RoleType.TfsAdmin;
        const applicantRole = RoleType.Applicant;
        const user = (roles: RoleType[]): User => {
            return {
                roles: roles.map(role => {
                    return {
                        name: role,
                    } as Role;
                }),
            } as User;
        };

        it('should return false given an empty list of allowedRoles', async () => {
            const requiredRoles: RoleType[] = [];
            const userRoles = [adminRole];

            const result = userHasRoles(user(userRoles), requiredRoles);

            expect(result).to.be.false;
        });

        it('should return false given an empty list of userRoles', async () => {
            const requiredRoles = [adminRole];
            const userRoles: RoleType[] = [];

            const result = userHasRoles(user(userRoles), requiredRoles);

            expect(result).to.be.false;
        });

        it('should return false given no matching roles', async () => {
            const requiredRoles = [adminRole];
            const userRoles = [applicantRole];

            const result = userHasRoles(user(userRoles), requiredRoles);

            expect(result).to.be.false;
        });

        it('should return true given one required role and two user roles including the required one', async () => {
            const requiredRoles = [adminRole];
            const userRoles = [adminRole, applicantRole];

            const result = userHasRoles(user(userRoles), requiredRoles);

            expect(result).to.be.true;
        });

        it('should return true given two required roles and a user roles matching one of them', async () => {
            const requiredRoles = [adminRole, applicantRole];
            const userRoles = [applicantRole];

            const result = userHasRoles(user(userRoles), requiredRoles);

            expect(result).to.be.true;
        });
    });
});
