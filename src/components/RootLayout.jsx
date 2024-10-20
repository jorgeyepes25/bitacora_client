import PropTypes from 'prop-types';
import { Toaster } from 'sonner';

export const RootLayout = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
};

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RootLayout;
