import React from 'react';

class MainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: '',
            title: '',
            lyrics: '',
            thereAreLyrics: null,
            isLoading: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading: true,
        });

        const lyricsAPI = 'https://api.lyrics.ovh/v1/';
        let lyricsRequest =
            lyricsAPI + this.state.artist + '/' + this.state.title;
        let result;

        fetch(lyricsRequest)
            .then((response) => response.json())
            .then((data) => (result = data))
            .then(() => {
                if (result.hasOwnProperty('error')) {
                    this.setState({ thereAreLyrics: false, isLoading: false });
                } else {
                    this.setState({
                        lyrics: result.lyrics,
                        thereAreLyrics: true,
                        isLoading: false,
                    });
                }
            });
    }
    handleChange(e) {
        const { value, name } = e.target;
        this.setState({ [name]: value });
        if (this.state.thereAreLyrics === false) {
            this.setState({ thereAreLyrics: true });
        }
    }
    render() {
        return (
            <div className="card my-5 shadow">
                <div className="card-body text-center">
                    <div className="form-group input-group input-group-lg">
                        <input
                            type="text"
                            name="artist"
                            id="artist"
                            className="form-control"
                            placeholder="Artist"
                            value={this.state.artist}
                            onChange={this.handleChange}
                            autoFocus
                        />
                    </div>
                    <div className="form-group input-group input-group-lg">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className="form-control"
                            placeholder="Song"
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                    </div>
                    <input
                        type="submit"
                        className="btn btn-dark btn-lg btn-block font-custom"
                        value="Get lyrics"
                        onClick={this.handleSubmit}
                    />
                    {this.state.isLoading ? (
                        <div
                            class="spinner-grow text-dark mt-4"
                            style={{ width: '3rem', height: '3rem' }}
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                    ) : null}

                    {this.state.thereAreLyrics === false ? (
                        <ErrorAlert
                            title={this.state.title}
                            artist={this.state.artist}
                        />
                    ) : null}
                    {this.state.lyrics != '' ? (
                        <Results
                            lyrics={this.state.lyrics}
                            artist={this.state.artist}
                            title={this.state.title}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}

function ErrorAlert(props) {
    return (
        <div className="alert bg-danger text-white text-center mt-2">
            There seems to be no <b>{props.artist}</b> song about{' '}
            <b>{props.title}</b>
        </div>
    );
}

function Results(props) {
    const addLineBreaks = (string) =>
        string.split('\n').map((text, index) => (
            <React.Fragment key={`${text}-${index}`}>
                {text}
                <br />
            </React.Fragment>
        ));

    return (
        <div>
            <hr />
            <h2 className="text-primary text-center font-custom">
                "{props.title}"
            </h2>
            <div className="text-center mb-5" id="lyrics">
                {addLineBreaks(props.lyrics)}
            </div>
            <div className="d-flex justify-content-between">
                <a
                    className="btn btn-outline-primary"
                    href={
                        'https://open.spotify.com/search/' +
                        props.artist +
                        ' ' +
                        props.title
                    }
                    target="_blank"
                >
                    Search on Spotify
                </a>
                <a
                    className="btn btn-outline-danger"
                    href={
                        'https://www.youtube.com/results?search_query=' +
                        props.artist +
                        ' ' +
                        props.title
                    }
                    target="_blank"
                >
                    Search on YouTube
                </a>
            </div>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className="container">
                    <div className="text-white font-custom display-4 text-center mt-4">
                        LyricsMachine
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3"></div>
                        <div className="col-lg-6">
                            <MainForm />
                        </div>
                        <div className="col-lg-3"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
