import { Component, type ReactNode } from "react";
import styles from "../styles/app.module.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorPage}>
          <div className={styles.errorCard}>
            <h1 className={styles.errorTitle}>Something went wrong</h1>
            <p className={styles.errorMessage}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={styles.reloadBtn}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
