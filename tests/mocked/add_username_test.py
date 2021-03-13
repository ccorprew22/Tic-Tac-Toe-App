"""
    add_username_test.py

    Tests to see if add_username adds new users and notices existing users.
"""

import unittest
#import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import add_username
#import Players

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'person1'


class AddUsernameTestCase(unittest.TestCase):
    """
    Add username test class
    """
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'person2A',
                KEY_EXPECTED: "New User Added: person2A",
            },
            {
                KEY_INPUT: 'person1',
                KEY_EXPECTED: "New User Added: person1",
            },
            {
                KEY_INPUT: 'person2A',
                KEY_EXPECTED: "Existing User: person2A",
            },
            {
                KEY_INPUT: 'person4T',
                KEY_EXPECTED: "New User Added: person4T",
            }
        ]

        #initial_person = Players.Player(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = []

    def mocked_db_session_add(self, username):
        """
        Mocked db.session.add
        """
        if str(username) in self.initial_db_mock:
            raise Exception
        self.initial_db_mock.append(str(username))

    def test_success(self):
        """test_success function"""
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                actual_result = add_username(test[KEY_INPUT])
                print("ACTUAL: " + actual_result)
                expected_result = test[KEY_EXPECTED]

                print("EXPECTED: " + expected_result)
                print(self.initial_db_mock)
                self.assertEqual(len(actual_result), len(expected_result))
                self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
