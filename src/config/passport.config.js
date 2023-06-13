import passport from 'passport';
import jwt from 'passport-jwt';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'CoderKey'
        },
        async (jwtPayload, done) => {
            try {

                return done(null, jwtPayload);

            } catch (error) {

                return done(error);

            };
        }
    ));

};

const cookieExtractor = (req) => {

    let token = null;

    if (req && req.cookies) {

        token = req.cookies['token'];

    };

    return token;

};

export default initializePassport;