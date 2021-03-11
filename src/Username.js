export function Username({ username, score, userLogged, index }) {
  let style = 'white';
  if (userLogged === username) {
    style = 'yellow';
  }

  return (
    <tr>
      <th className={style} scope="row">
        {index}
      </th>
      <td className={style}>{username}</td>
      <td className={style}>{score}</td>
    </tr>
  );
}
