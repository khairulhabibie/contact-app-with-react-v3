import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import { getContacts, deleteContact } from '../utils/api';
import { LocaleConsumer } from '../contexts/LocaleContext';

function HomePageWrapper() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword');

  function changeSearchParams(keyword) {
    setSearchParams({ keyword });
  }

  return <HomePage defaultKeyword={keyword} keywordChange={changeSearchParams} />
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      keyword: props.defaultKeyword || '',
    }

    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onKeywordChangeHandler = this.onKeywordChangeHandler.bind(this);
  }

  async onDeleteHandler(id) {
    await deleteContact(id);

    // update the contact state from api.js
    const { data } = await getContacts();
    this.setState(() => {
      return {
        contacts: data,
      }
    });
  }

  onKeywordChangeHandler(keyword) {
    this.setState(() => {
      return {
        keyword,
      }
    });

    this.props.keywordChange(keyword);
  }

  async componentDidMount() {
    const { data } = await getContacts();

    this.setState(() => {
      return {
        contacts: data
      }
    })
  }

  render() {
    const contacts = this.state.contacts.filter((contact) => {
      return contact.name.toLowerCase().includes(
        this.state.keyword.toLowerCase()
      );
    });

    return (
      <LocaleConsumer>
        {({ locale }) => {
          return (
            <section>
              <h2>{locale === 'id' ? 'Daftar Kontak' : 'Contacts List'}</h2>
              <SearchBar keyword={this.state.keyword} keywordChange={this.onKeywordChangeHandler} />
              <ContactList contacts={contacts} onDelete={this.onDeleteHandler} />
            </section>
          )
        }}
      </LocaleConsumer>
    )
  }
}

export default HomePageWrapper;