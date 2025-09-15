[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-1.0--SNAPSHOT-orange.svg)]()

Client-side components and utilities for building robust, scalable enterprise client applications in the Strata Framework Set. This library provides Model-View-Presenter (MVP) architecture, React integration, UI component libraries, and client-side patterns for building high-performance client applications.

## Features

- **MVP Architecture**: Model-View-Presenter pattern implementation with clean separation of concerns
- **Multi-Platform Support**: TypeScript/JavaScript and Java client components with cross-platform compatibility
- **React Integration**: Enhanced React components with MVP pattern integration and state management
- **UI Component Libraries**: Material-UI and Blueprint.js integration with MVP-aware components
- **State Management**: Centralized model store with reactive updates and presenter coordination
- **Spring Client Integration**: REST client abstractions with reactive and traditional HTTP support
- **Component Framework**: Modular component architecture for scalable client application development
- **Testing Support**: Comprehensive testing utilities and fixtures for client components

## Architecture

The Strata.Client framework follows a modular architecture with clear separation of concerns:

![Strata Client Components](Strata-Client-Components.png)

Each component builds upon the core MVP abstractions while providing specialized functionality for specific client-side use cases and UI frameworks.

## Components

### Strata.Client.Core

The foundational client component that provides essential MVP abstractions and utilities for enterprise client application development:

**Java Modules:**
- `strata.client.core.main` - Core application abstractions and lifecycle management
  - IApplication interface for application contracts
  - AbstractApplication base class for MVP application implementations
- `strata.client.core.presenter` - MVP pattern implementations
  - IPresenter interface for Model-View-Presenter coordination
  - AbstractPresenter base class for presenter implementations
  - IModelStore interface for centralized state management
  - ModelStore implementation with reactive updates
  - IUpdatable interface for component lifecycle management
  - AbstractUpdatable base class for updatable components
  - IViewCreator interface for view instantiation abstractions
  - IAction and Action implementations for command pattern support
  - SimpleAction for basic action implementations
- `strata.client.core.service` - HTTP client abstractions and REST service communication
  - AbstractRestClient for REST API communication
  - IResponse interface for HTTP response handling
  - StandardResponse implementation for standard HTTP responses
  - IResponseProcessor interface for response processing
  - StandardResponseProcessor for standard response handling
  - IHeadersConsumer interface for HTTP header management
- `strata.client.core.inject` - Dependency injection and configuration abstractions
  - IBaseUrlProvider interface for base URL configuration
  - PropertiesBasedBaseUrlProvider for properties-based URL configuration

**TypeScript Modules:**
- `Main` - Core application abstractions
  - AbstractApplication for application lifecycle management
  - IApplication interface for application contracts
- `Presenter` - MVP pattern implementations in TypeScript
  - AbstractPresenter base class for presenter implementations
  - AbstractUpdatable base class for updatable components
  - IPresenter, IModelStore, IUpdatable interfaces
  - ModelStore implementation with reactive state management
  - Action and SimpleAction for command pattern support
  - IView, IViewVisitor, IPresentable interfaces for view abstractions
- `Serialization` - Browser storage abstractions
  - LocalStorageObjectReader and LocalStorageObjectWriter for localStorage integration
  - SessionStorageObjectReader and SessionStorageObjectWriter for sessionStorage integration
- `Service` - HTTP client abstractions
  - AbstractRestClient for REST API communication
  - IResponse, IResponseProcessor for response handling
  - ServiceError for error management
  - StandardResponse and StandardResponseProcessor implementations
  - IHeadersConsumer for HTTP header management

### Strata.Client.React

React Framework integration component that extends core MVP abstractions with React-specific implementations:

**TypeScript Modules:**
- `Main` - React application integration
  - ReactApplication component for React-based applications
- `Presenter` - React-specific presenter implementations
  - PresenterView component for React MVP integration
  - RenderableView for component rendering abstractions
  - IPresenterViewProperty for presenter-view property binding
  - IRenderable and IRenderableViewProperty for rendering contracts

### Strata.Client.Mui

Material-UI integration component providing Material Design components with MVP pattern support:

**TypeScript Modules:**
- `Dropdown` - Material-UI dropdown components with MVP integration
- `LoginOrRegister` - Authentication UI components using Material Design
- `Navigation` - Material-UI navigation components and menu systems
- `Utility` - Material-UI utility functions and helper components

### Strata.Client.Blueprint

Blueprint.js integration component providing desktop-focused UI components with MVP pattern support:

**TypeScript Modules:**
- `LoginOrRegister` - Authentication UI components using Blueprint.js design system
- `Navigation` - Blueprint.js navigation components optimized for desktop applications

### Strata.Client.Spring

Spring Framework integration component for client-side REST communication and service integration:

**Java Modules:**
- `strata.client.spring.service` - REST client abstractions
  - AbstractSpringRestClient for traditional HTTP operations
  - AbstractReactiveRestClient for reactive HTTP operations
  - Service configuration and client setup utilities
  - Error handling and response processing

## Installation

### Gradle

Add the following dependencies to your `build.gradle`:

```gradle
dependencies {
    implementation 'strata.client:strata-client-core:1.0-SNAPSHOT'
    implementation 'strata.client:strata-client-react:1.0-SNAPSHOT'
    implementation 'strata.client:strata-client-mui:1.0-SNAPSHOT'
    implementation 'strata.client:strata-client-blueprint:1.0-SNAPSHOT'
    implementation 'strata.client:strata-client-spring:1.0-SNAPSHOT'

    // For testing
    testImplementation 'strata.client:strata-client-core-test:1.0-SNAPSHOT'
    testImplementation 'strata.client:strata-client-react-test:1.0-SNAPSHOT'
}
```

### npm/yarn

Add the following dependencies to your `package.json`:

```json
{
  "dependencies": {
    "strata.client.core": "0.0.0-snapshot",
    "strata.client.react": "0.0.0-snapshot",
    "strata.client.mui": "0.0.0-snapshot",
    "strata.client.blueprint": "0.0.0-snapshot"
  }
}
```

Install with yarn:
```bash
yarn install
```

### Repository Configuration

This package is published to GitHub Packages. Add the repository to your build configuration:

```gradle
repositories {
    maven {
        name "GitHubPackages"
        url "https://maven.pkg.github.com/StrataFrameworkSet/repository"
        credentials {
            username = project.findProperty("gpr.user") ?: System.getenv("USERNAME")
            password = project.findProperty("gpr.key") ?: System.getenv("TOKEN")
        }
    }
}
```

## Usage

### Basic MVP Application Setup

```java
import strata.client.core.presenter.IPresenter;
import strata.client.core.presenter.IModelStore;
import strata.client.core.presenter.ModelStore;

// Define your presenter
public class CustomerPresenter implements IPresenter<CustomerModel, CustomerView> {
    private final CustomerView view;
    private final IModelStore modelStore;

    public CustomerPresenter(CustomerView view, IModelStore modelStore) {
        this.view = view;
        this.modelStore = modelStore;
    }

    @Override
    public CustomerView getView() {
        return view;
    }

    @Override
    public void start() {
        // Initialize presenter and bind to model store
        modelStore.attach(this);
        view.initialize();
    }

    @Override
    public void stop() {
        // Cleanup presenter and detach from model store
        modelStore.detach(this);
        view.cleanup();
    }

    @Override
    public void update(CustomerModel model) {
        // React to model changes
        view.updateDisplay(model);
    }
}
```

### TypeScript MVP Implementation

```typescript
import { IPresenter, IModelStore, IUpdatable } from 'strata.client.core';

class CustomerPresenter implements IPresenter<CustomerModel, CustomerView> {
    constructor(
        private view: CustomerView,
        private modelStore: IModelStore
    ) {}

    getView(): CustomerView {
        return this.view;
    }

    start(): void {
        this.modelStore.attach(this);
        this.view.initialize();
    }

    stop(): void {
        this.modelStore.detach(this);
        this.view.cleanup();
    }

    update(model: CustomerModel): void {
        this.view.updateDisplay(model);
    }
}
```

### React Integration

```typescript
import React, { useEffect } from 'react';
import { usePresenter, useModelStore } from 'strata.client.react';

interface CustomerComponentProps {
    presenter: IPresenter<CustomerModel, CustomerView>;
}

const CustomerComponent: React.FC<CustomerComponentProps> = ({ presenter }) => {
    const [model, setModel] = useModelStore<CustomerModel>(CustomerModel);
    const [isStarted, setIsStarted] = usePresenter(presenter);

    useEffect(() => {
        if (isStarted) {
            presenter.start();
        }
        return () => presenter.stop();
    }, [isStarted, presenter]);

    return (
        <div>
            <h1>{model?.name || 'Loading...'}</h1>
            <p>{model?.email}</p>
        </div>
    );
};
```

### Material-UI Integration

```typescript
import React from 'react';
import { Button, TextField, Paper } from '@mui/material';
import { MvpFormComponent } from 'strata.client.mui';

const CustomerForm: React.FC = () => {
    return (
        <MvpFormComponent>
            <Paper elevation={2} style={{ padding: 16 }}>
                <TextField
                    label="Customer Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                />
                <Button variant="contained" color="primary">
                    Save Customer
                </Button>
            </Paper>
        </MvpFormComponent>
    );
};
```

### Spring REST Client Integration

```java
import strata.client.spring.service.AbstractSpringRestClient;
import org.springframework.web.reactive.function.client.WebClient;

public class CustomerRestClient extends AbstractSpringRestClient {
    private final WebClient webClient;

    public CustomerRestClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public CompletableFuture<Customer> getCustomer(String customerId) {
        return webClient
            .get()
            .uri("/api/customers/{id}", customerId)
            .retrieve()
            .bodyToMono(Customer.class)
            .toFuture();
    }

    public CompletableFuture<Customer> saveCustomer(Customer customer) {
        return webClient
            .post()
            .uri("/api/customers")
            .bodyValue(customer)
            .retrieve()
            .bodyToMono(Customer.class)
            .toFuture();
    }
}
```

### Testing with Client Test Utilities

```java
import strata.client.core.test.ClientTestBase;
import strata.client.react.test.ReactClientTest;

@ReactClientTest
public class CustomerPresenterTest extends ClientTestBase {

    @Test
    public void testCustomerPresenterLifecycle() {
        // Arrange
        CustomerModel model = createTestCustomer();
        CustomerView mockView = mock(CustomerView.class);
        IModelStore modelStore = new ModelStore();
        CustomerPresenter presenter = new CustomerPresenter(mockView, modelStore);

        // Act
        presenter.start();
        modelStore.insert(CustomerModel.class, model);
        presenter.stop();

        // Assert
        verify(mockView).initialize();
        verify(mockView).updateDisplay(model);
        verify(mockView).cleanup();
    }
}
```

## Building

### Prerequisites

- Java 11 or higher
- Node.js 16 or higher
- Yarn package manager
- Gradle 7.0 or higher

### Build Commands

```bash
# Build all components
yarn build

# Build specific components
yarn run build-strata-client-core
yarn run build-strata-client-react
yarn run build-strata-client-mui
yarn run build-strata-client-blueprint

# Build Java components
./gradlew build

# Run tests
yarn test
./gradlew test

# Clean build artifacts
yarn clean

# Publish to local repository
./gradlew publishToMavenLocal

# Publish to GitHub Packages (requires credentials)
./gradlew publish
```

### Project Structure

```
Strata.Client/
├── Applications/
│   └── strata.client.reacthello/    # React Hello World example application
├── Components/
│   ├── Strata.Client.Core/          # Core MVP framework and abstractions
│   ├── Strata.Client.React/         # React Framework integration
│   ├── Strata.Client.Mui/           # Material-UI component integration
│   ├── Strata.Client.Blueprint/     # Blueprint.js component integration
│   └── Strata.Client.Spring/        # Spring REST client integration
├── Tests/
│   └── Strata.Client.ReactTest/     # React testing framework and utilities
├── build.gradle                     # Root build configuration
├── package.json                     # Root package configuration
├── settings.gradle                  # Gradle settings
└── README.md                        # This file
```

## Contributing

We welcome contributions to the Strata.Client project! Please follow these guidelines:

1. **Fork the repository** and create your feature branch from `development`
2. **Follow the coding standards** established in the existing codebase
3. **Write tests** for your changes and ensure all existing tests pass
4. **Update documentation** as needed for your changes
5. **Submit a pull request** with a clear description of your changes

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/StrataFrameworkSet/Strata.Client.git
   cd Strata.Client
   ```

2. Build the project:
   ```bash
   yarn install
   yarn build
   ./gradlew build
   ```

3. Run tests to ensure everything works:
   ```bash
   yarn test
   ./gradlew test
   ```

### Code Style

- Follow Java and TypeScript naming conventions
- Use meaningful variable and method names
- Add appropriate JavaDoc/TSDoc comments for public APIs
- Maintain consistent indentation and formatting
- Write comprehensive unit tests for new functionality
- Follow MVP architectural patterns consistently

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please:

1. Check the [Issues](https://github.com/StrataFrameworkSet/Strata.Client/issues) page for existing questions
2. Create a new issue if your question hasn't been addressed
3. For development discussions, join our community channels

## Related Projects

- [Strata.Foundation](https://github.com/StrataFrameworkSet/Strata.Foundation) - Foundational components and utilities
- [Strata.Server](https://github.com/StrataFrameworkSet/Strata.Server) - Server-side components and utilities

---

**Strata.Client** is part of the Strata Framework Set, providing enterprise-grade client-side components for building scalable, maintainable applications.
