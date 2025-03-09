import React from 'react';

const ChatHeader = () => {
  return (
    <div style={styles.header}>
      <h2 style={styles.title}>🍷 DLink</h2>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#900020',
    color: 'white',
    padding: '10px 15px',
    textAlign: 'center',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
  },
};

export default ChatHeader;