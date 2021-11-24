import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import NotFound from '../containers/NotFound';
import requireLogin from './guards/requireLogin';
import getRoutes from './routes';

const Router = ({ children }) => {

  const routes = useMemo(() => getRoutes(), []);
  return (
    <BrowserRouter>
      <GuardProvider guards={[requireLogin]} loading="Loading..." error={NotFound}>
        
        <Route
          render={routeProps =>          
            children(
            <TransitionGroup>
              <Switch>                                              
                {routes.map(({ component: Component, error, exact, ignoreGlobal, loading, meta, path }, i) => (   
                  <GuardedRoute
                    key={i}
                    exact={exact}
                    error={error}
                    ignoreGlobal={ignoreGlobal}
                    loading={loading}
                    meta={meta}
                    path={path}
                  >  
                    {
                      ignoreGlobal ? 
                        <Component/> : 
                        <CSSTransition
                          in={routeProps.match != null}
                          timeout={300}
                          classNames="page"
                          unmountOnExit
                        >
                          <Component/>
                        </CSSTransition>
                    }                                                   
                  </GuardedRoute>
                ))}
                </Switch>
              </TransitionGroup>,
              routeProps,
            )
          }
        />
      </GuardProvider>
    </BrowserRouter>
  );
};

Router.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Router;
