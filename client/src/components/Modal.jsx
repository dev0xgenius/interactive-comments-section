import { AnimatePresence, motion } from "motion/react";
import PropTypes from "prop-types";

export default function Modal(props) {
  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div
          className="fixed z-20 flex items-center justify-center
            h-screen w-screen px-6 modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.div
            className="modal rounded-xl max-w-96 bg-white-100 p-6 shadow-modal border border-blue-200/20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <div className="container max-w-max flex flex-col gap-4">
              <h1 className="text-left font-bold text-2xl text-blue-600">
                {props.headerMsg}
              </h1>
              <main>
                <p className="text-blue-500 leading-relaxed">{props.mainMsg}</p>
              </main>
              <footer className="w-full">
                <div className="container w-full gap-2 flex justify-between">
                  <motion.button
                    onClick={() => props.handleResponse(false)}
                    className="bg-blue-500 text-white-100
                      rounded-lg px-5 py-3 font-semibold w-full cursor-pointer
                      transition-all duration-150 hover:shadow-md hover:brightness-110"
                    whileTap={{ scale: 0.98 }}
                  >
                    NO, CANCEL
                  </motion.button>
                  <motion.button
                    onClick={() => props.handleResponse(true)}
                    className="bg-red-100 text-white-100
                      rounded-lg px-5 py-3 font-semibold w-full cursor-pointer
                      transition-all duration-150 hover:shadow-md hover:brightness-110"
                    whileTap={{ scale: 0.98 }}
                  >
                    YES, CONTINUE
                  </motion.button>
                </div>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  headerMsg: PropTypes.string,
  mainMsg: PropTypes.string,
  handleResponse: PropTypes.func,
};
